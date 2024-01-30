/*
https://docs.nestjs.com/providers#services
*/

import {
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { MESSAGE_ERROR, OPTION_GO_TO_PAGE, WEBSITE } from 'src/constants';
import { formatPhoneNumber, parseWebsite, setDelay } from 'src/helper';
import { PlacesService } from 'src/modules/places/places.service';

import { BrowserService } from 'src/browser.service';
import { AuthService } from './service/auth.service';
@Injectable()
export class GoogleService {
  private googleUrl: string;
  private googleMapUrl: string;
  constructor(
    private browser: BrowserService,
    private placeService: PlacesService,
    private authService: AuthService,
  ) {}

  public async onModuleInit(): Promise<any> {
    this.googleUrl = `${WEBSITE.GOOGLE.URL}/?hl=en-US`;
    this.googleMapUrl = WEBSITE.GOOGLE.MAP_URL;
  }

  async searchPlacesGoogle(payload): Promise<any> {
    const { browser, page, keyboard } = await this.browser.createBrowser();
    try {
      await page.goto(this.googleUrl, OPTION_GO_TO_PAGE);
      const search = `${payload.term} in ${payload.where}`;
      await this.authService.autoSearchGoogle(page, keyboard, search);
      const placesEL = await page.$(WEBSITE.GOOGLE.PLACESE);
      if (!placesEL) throw new BadRequestException(MESSAGE_ERROR.NOT_FUND_DATA);
      const buttonMoreEl = await page.$('.iNTie a');
      if (buttonMoreEl) {
        await buttonMoreEl.click();
        await page.waitForNavigation();
      }

      const placeList = [];
      while (true) {
        await setDelay(2000);
        const placeListEl = await page.$$(WEBSITE.GOOGLE.PLACE_ITEM);
        if (!placeListEl) break;

        for (const placeEl of placeListEl) {
          console.log('pageNumber', placeEl);
          await placeEl.evaluate((element: any) => element.click());
          await setDelay(1000);
          const detailContainer = await page.waitForSelector(
            WEBSITE.GOOGLE.PLACE_ITEM_CONTAINER,
            { timeout: 3000 },
          );
          if (await page.$(WEBSITE.GOOGLE.PLACE_IS_ACTIVE)) continue;
          const googleMapIdEl = await page.$(WEBSITE.GOOGLE.PLACE_ITEM_CID);
          const googleMapId = await googleMapIdEl
            .evaluate((el) => el.getAttribute('data-cid'))
            .catch(() => undefined);
          const googleMapLink = `${this.googleMapUrl}?cid=${googleMapId}`;

          const checkGoogleId =
            await this.placeService.findByGoogleId(googleMapLink);
          if (checkGoogleId) continue;
          if (placeList?.some((i) => i.googleMapLink === googleMapLink))
            continue;

          const displayName = await page
            .evaluate(
              (el: Element) =>
                el.querySelector('h2[data-attrid="title"]').textContent,
              detailContainer,
            )
            .catch(() => undefined);
          if (!displayName) continue;

          const categories = await page
            .evaluate(
              (el: Element) => el.querySelector('.TLYLSe .zloOqf').textContent,
              detailContainer,
            )
            .catch(() => undefined);
          const website = await page
            .evaluate(
              (el: any) => el.querySelector('.zhZ3gf [ssk="1#0"] a').href,
              detailContainer,
            )
            .catch(() => undefined);

          const imageList = await page
            .waitForSelector('[jsmodel="fadmnd"]')
            .catch(() => undefined);

          let imagesUrl = [];
          if (imageList) {
            await imageList.click();
            await setDelay(1000);
            await page.waitForSelector('c-wiz');

            imagesUrl = await page
              .$$eval('[jscontroller="U0Base"]', (els: Element[]) => {
                return els.map((el: Element) => {
                  const link = el.querySelector('img').src;
                  const coverLink = link?.split('=')[0];
                  return coverLink;
                });
              })
              .catch(() => undefined);
            const closeImageList = await page.waitForSelector(
              'button[data-mdc-dialog-action="close"]',
            );

            await closeImageList.click();
            await setDelay(1000);
          }

          const address = await page
            .evaluate(
              (el: Element) =>
                el.querySelector(
                  '.wDYxhc .Z1hOCe [data-local-attribute="d3adr"] .LrzXr',
                ).textContent,
              detailContainer,
            )
            .catch(() => undefined);
          const parts = address?.split(',').map((part) => part.trim());
          const parserAddress = {
            address: parts[0],
            ward: parts[1],
            district: parts[2],
            city: parts[3]?.replace(/\d/g, '').trim(),
          };
          const phoneNumber = await page
            .evaluate(
              (el: Element) =>
                el.querySelector(
                  '.wDYxhc .Z1hOCe [data-local-attribute="d3ph"] .LrzXr a span[aria-label]',
                ).textContent,
              detailContainer,
            )
            .catch(() => undefined);
          const linkProfileEl = await page
            .$$eval('.OOijTb .PZPZlf g-link ', (els: Element[]) => {
              return els.map((el: Element) => {
                const link = el.querySelector('a').href;
                return link;
              });
            })
            .catch(() => undefined);

          const newPlace = {
            website,
            ...parserAddress,
            displayName,
            googleMapLink,
            imagesUrl,
            thumbnailUrl: imagesUrl?.[0],
            linkProfile: parseWebsite(linkProfileEl),
            phoneNumber: phoneNumber
              ? formatPhoneNumber(phoneNumber)
              : undefined,
            categories: categories?.replace(/[$₫]/g, ''),
          };

          await this.placeService.upsert(newPlace);

          placeList.push({ ...newPlace });
        }
        const buttonNextPageEl = await page.$('table tbody tr td #pnnext');
        if (buttonNextPageEl) {
          await buttonNextPageEl.click();
          await page.waitForNavigation();
        } else {
          break;
        }
      }
    } catch (e) {
      throw new UnprocessableEntityException(e?.message);
    } finally {
      await browser.close();
    }
  }
}
