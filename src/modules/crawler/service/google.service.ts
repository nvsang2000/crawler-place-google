/*
https://docs.nestjs.com/providers#services
*/

import {
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { Keyboard, Page } from 'puppeteer';
import {
  KEYBOARD_ENTER,
  MESSAGE_ERROR,
  OPTION_GO_TO_PAGE,
  WEBSITE,
} from 'src/constants';
import {
  formatPhoneNumber,
  parseWebsite,
  promisesSequentially,
  setDelay,
} from 'src/helper';
import { ConfigService } from '@nestjs/config';
import { BrowserService } from './browser.service';
import { PlacesService } from 'src/modules/places/places.service';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
@Injectable()
export class GoogleService {
  private googleUrl: string;
  private googleMapUrl: string;
  constructor(
    private config: ConfigService,
    private browser: BrowserService,
    private placeService: PlacesService,
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
      await this.autoSearchGoogle(page, keyboard, search);
      const placesEL = await page.$(WEBSITE.GOOGLE.PLACESE);
      if (!placesEL) throw new BadRequestException(MESSAGE_ERROR.NOT_FUND_DATA);
      const buttonMoreEl = await page.$('.iNTie a');
      if (buttonMoreEl) {
        await buttonMoreEl.click();
        await page.waitForNavigation();
      }
      let pageNumber = 0;

      const placeList = [];
      while (true) {
        await setDelay(2000);
        const placeListEl = await page.$$(WEBSITE.GOOGLE.PLACESE_ITEM);
        if (!placeListEl) break;

        for (const [i, placeEl] of placeListEl.entries()) {
          console.log('pageNumber, index', pageNumber, i, placeListEl.length);
          await placeEl.evaluate((element: any) => element.click());
          await setDelay(1000);
          const detailContainer = await page.waitForSelector(
            WEBSITE.GOOGLE.PLACESE_ITEM_CONTAINER,
            { timeout: 3000 },
          );
          if (await page.$(WEBSITE.GOOGLE.PLACE_IS_ACTIVE)) continue;
          const googleMapIdEl = await page.$(WEBSITE.GOOGLE.PLACESE_ITEM_CID);
          const googleMapId = await googleMapIdEl
            .evaluate((el) => el.getAttribute('data-cid'))
            .catch(() => undefined);
          const googleMapLink = `${this.googleMapUrl}?cid=${googleMapId}`;
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
          const imagesUrl = await page.evaluate(() => {
            const buttons = document.querySelectorAll(
              '.Rbx14 button[data-clid="local-photo-browser"]',
            );
            const srcList = [];
            buttons.forEach((button: any) => {
              const backgroundImageStyle =
                button.querySelector('.vwrQge').style.backgroundImage;
              const srcMatches = backgroundImageStyle.match(/url\((.*?)\)/);
              if (srcMatches && srcMatches[1]) {
                srcList.push(srcMatches[1].replace(/"/g, ''));
              }
            });

            return srcList;
          });
          const address = await page
            .evaluate(
              (el: Element) =>
                el.querySelector(
                  '.wDYxhc .Z1hOCe [data-local-attribute="d3adr"] .LrzXr',
                ).textContent,
              detailContainer,
            )
            .catch(() => undefined);
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
            address,
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
          pageNumber++;
          await buttonNextPageEl.click();
          await page.waitForNavigation();
        } else {
          break;
        }
      }
    } catch (e) {
      console.log(e);
      throw new UnprocessableEntityException(e?.message);
    } finally {
      //await browser.close();
    }
  }

  async manyBrowser() {
    const accountList = [
      { username: 'khoa08407@gmail.com', password: 'Sa1234567890@' },
      { username: 'hoavannam2378@gmail.com', password: 'Sa1234567890@' },
    ];

    const promisesAcount = accountList?.map((i) => {
      return async () => {
        const browser = await puppeteer.use(StealthPlugin()).launch({
          headless: false,
          ignoreDefaultArgs: ['--disable-extensions'],
          //userDataDir: './browser',
        });

        const page = await browser.newPage();
        await this.processLogin(i.username, i.password, page);
        await setDelay(1000);
        await page.goto(
          'https://www.tiktok.com/@diepminh40/video/7322431831775710466?lang=en',
          OPTION_GO_TO_PAGE,
        );
        // await this.processCreateAccount(page);
      };
    });

    return await promisesSequentially(promisesAcount, promisesAcount?.length);
  }

  async newBrowserCreateAccount() {
    const browser = await puppeteer.use(StealthPlugin()).launch({
      headless: false,
      ignoreDefaultArgs: ['--disable-extensions'],
      //userDataDir: './browser',
    });

    const page = await browser.newPage();
    await this.processCreateAccount(page);
  }

  async processCreateAccount(page: Page) {
    await page.goto(
      'https://accounts.google.com/SignOutOptions?hl=en&continue=https://www.google.com.vn/%3Fhl%3Den&ec=GBRAmgQ',
      OPTION_GO_TO_PAGE,
    );

    const linkCreate = await page.waitForSelector('.add');
    await linkCreate.click();
    await setDelay(300);

    // const signInLink = await page.evaluate(() => {
    //   const anchors = document.getElementsByTagName('a');
    //   for (const anchor of anchors as any) {
    //     if (anchor.innerText === 'Sign in') {
    //       return anchor.href;
    //     }
    //   }
    //   return null;
    // });
    // await page.goto(signInLink);

    const buttonCreate = await page.waitForSelector(
      'button[aria-haspopup="menu"]',
      { timeout: 10000 },
    );

    await buttonCreate.click();
    await setDelay(1000);

    const selectLink = await page.waitForSelector('li[jsname="RZzeR"]');
    await selectLink.click();
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await setDelay(2000);

    const inputFistName = await page.$('[name="firstName"]');
    const inputLastName = await page.$('[name="lastName"]');
    if (inputFistName && inputLastName) {
      await inputFistName.evaluate((el: any) => (el.value = ''));
      await page.type('[name="firstName"]', 'sdfsdfsdf', { delay: 100 });

      await inputLastName.evaluate((el: any) => (el.value = ''));
      await page.type('[name="lastName"]', 'đfgdfgdfg', { delay: 100 });
      await page.keyboard.press(KEYBOARD_ENTER);
    }

    const selectMonth = await page.waitForSelector('#month');
    if (selectMonth) await page.select('#month', '1');
    await setDelay(300);
    const selectGender = await page.waitForSelector('#gender');
    if (selectGender) await page.select('#gender', '2');
    await setDelay(300);
    await page.keyboard.press(KEYBOARD_ENTER);

    const inputDay = await page.waitForSelector('input[name="day"]');
    if (inputDay) await Promise.all([setDelay(2000)]);

    await page.type('input[type="tel"]', '12', { delay: 100 });
    await page.type('input[name="year"]', '1998', {
      delay: 100,
    });

    await page.click('[type="button"]');
    await setDelay(2000);

    const selectEmail = await page.waitForSelector(
      '[aria-labelledby="selectioni1"]',
    );
    await setDelay(1000);
    await selectEmail.click();
    await page.click('[type="button"]');

    await setDelay(2000);
    const inputPassword = await page.$('input[name="Passwd"]');
    if (inputPassword) {
      await page.type('input[name="Passwd"]', 'Sa19876509@', { delay: 100 });
    }

    const inputConfirmPassword = await page.$('input[name="PasswdAgain"]');
    if (inputConfirmPassword) {
      await page.type('input[name="PasswdAgain"]', 'Sa19876509@', {
        delay: 100,
      });
    }

    await page.click('[type="button"]');
  }

  async loginGoogle(email: string, password: string) {
    const browser = await puppeteer.use(StealthPlugin()).launch({
      headless: false,
      ignoreDefaultArgs: ['--disable-extensions'],
      userDataDir: './browser',
    });
    const page = await browser.newPage();
    await this.processLogin(email, password, page);

    return {
      message: 'Logged in successfully!',
    };
  }
  async processLogin(email: string, password: string, page: Page) {
    await page.goto(this.googleUrl, OPTION_GO_TO_PAGE);
    const signInLink = await page.evaluate(() => {
      const anchors = document.getElementsByTagName('a');
      for (const anchor of anchors as any) {
        if (anchor.innerText === 'Sign in') {
          return anchor.href;
        }
      }
      return null;
    });
    if (!signInLink) return { message: 'Logged in oke!' };
    await page.goto(signInLink);
    const inputEmailEl = await page.$(WEBSITE.GOOGLE.INPUT_EMAIL);
    if (inputEmailEl) {
      await inputEmailEl.evaluate((el: any) => (el.value = ''));
      await page.type(WEBSITE.GOOGLE.INPUT_EMAIL, email, { delay: 100 });
      await page.keyboard.press(KEYBOARD_ENTER);
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    }
    await page.waitForFunction(
      () => !document.querySelector('*[aria-busy="true"]'),
      { timeout: 10000 },
    );
    const inputPasswordEl = await page.$(WEBSITE.GOOGLE.INPUT_PASSWORD);
    if (inputPasswordEl) {
      await inputPasswordEl.evaluate((el: any) => (el.value = ''));
      await page.type(WEBSITE.GOOGLE.INPUT_PASSWORD, password, {
        delay: 100,
      });
      await page.keyboard.press(KEYBOARD_ENTER);
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    }
  }

  async autoSearchGoogle(page: Page, keyboard: Keyboard, textSearch: string) {
    await page.waitForSelector(WEBSITE.GOOGLE.INPUT_SEARCH);
    const inputSearchEl = await page.$(WEBSITE.GOOGLE.INPUT_SEARCH);
    await inputSearchEl.evaluate((el: any) => (el.value = ''));
    await inputSearchEl.type(textSearch, { delay: 100 });
    await keyboard.press(KEYBOARD_ENTER);
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  }
}
