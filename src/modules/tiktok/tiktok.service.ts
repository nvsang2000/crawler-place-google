/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { OPTION_GO_TO_PAGE } from 'src/constants';
import { promisesSequentially, setDelay } from 'src/helper';
import { AuthService } from '../google/service/auth.service';
@Injectable()
export class TiktokService {
  constructor(private authService: AuthService) {}

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
        await this.authService.processLogin(i.username, i.password, page);
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
}
