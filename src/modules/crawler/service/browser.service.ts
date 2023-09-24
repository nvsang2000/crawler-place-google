/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Keyboard, Page, PuppeteerLaunchOptions } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

@Injectable()
export class BrowserService {
  async createBrowser(options?: PuppeteerLaunchOptions) {
    const browser = await puppeteer.use(StealthPlugin()).launch({
      ...options,
      headless: false,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--deterministic-fetch',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
      ],
      ignoreDefaultArgs: ['--disable-extensions'],
      userDataDir: '/browser',
    });
    try {
      const page = await browser.newPage();
      await page.setCacheEnabled(true);
      const keyboard: Keyboard = page.keyboard;
      return { browser, page, keyboard };
    } catch (e) {
      console.log(e);
      await browser.close();
      throw new UnprocessableEntityException(e?.nessage);
    }
  }

  async scrollTopEndPage(page: Page) {
    return await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      window.scrollTo(0, scrollHeight);
    });
  }
}
