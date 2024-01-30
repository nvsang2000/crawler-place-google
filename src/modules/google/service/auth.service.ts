/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Keyboard, Page } from 'puppeteer';
import { KEYBOARD_ENTER, OPTION_GO_TO_PAGE, WEBSITE } from 'src/constants';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { setDelay } from 'src/helper';
import { LoginGoogleDto } from '../dto/login-google.dto';

@Injectable()
export class AuthService {
  private googleUrl: string;

  public async onModuleInit(): Promise<any> {
    this.googleUrl = `${WEBSITE.GOOGLE.URL}/?hl=en-US`;
  }

  async createAccount() {
    const browser = await puppeteer.use(StealthPlugin()).launch({
      headless: false,
      ignoreDefaultArgs: ['--disable-extensions'],
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

  async loginGoogle(payload: LoginGoogleDto) {
    const { email, password } = payload;
    const browser = await puppeteer.use(StealthPlugin()).launch({
      headless: false,
      ignoreDefaultArgs: ['--disable-extensions'],
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
