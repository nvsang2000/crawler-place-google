import { CrawlerController } from './crawler.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { CrawlerService } from './service/crawler.service';
import { BrowserService } from './service/browser.service';
import { GoogleService } from './service/google.service';

@Module({
  imports: [],
  controllers: [CrawlerController],
  providers: [CrawlerService, BrowserService, GoogleService],
})
export class CrawlerModule {}
