/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { OPTION_GO_TO_PAGE } from 'src/constants';
import { promisesSequentially, setDelay } from 'src/helper';
import { AuthService } from '../google/service/auth.service';
import path from 'path';
@Injectable()
export class TiktokService {
  constructor(private authService: AuthService) {}

  async login() {
    const accountList = [
      { username: 'joinnguyen477@gmail.com', password: 'Nguyen1234@' },
      { username: 'hoavannam2378@gmail.com', password: 'Sa1234567890@' },
    ];

    const pathToExtension = path.join(process.cwd(), './extensions/TOUCH_VPN');
    const promisesAcount = accountList?.map((i) => {
      return async () => {
        const browser = await puppeteer.use(StealthPlugin()).launch({
          headless: false,
          args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
          ],
          userDataDir: `./account/${i?.username}`,
        });

        const page = await browser.newPage();
        await this.authService.processLogin(i.username, i.password, page);
        await setDelay(1000);
        await page.goto(
          'https://www.tiktok.com/@diepminh40/video/7322101290727722241',
          OPTION_GO_TO_PAGE,
        );
        // await this.processCreateAccount(page);
        await page.waitForSelector('#loginContainer');
        await setDelay(1000);

        await page.$$eval('[data-e2e="channel-item"]', (els) => {
          return els?.map((el: any) => {
            const text = el.textContent;
            if (text.includes('Continue with Google')) el.click();
          });
        });
      };
    });

    return await promisesSequentially(promisesAcount, promisesAcount?.length);
  }
}
