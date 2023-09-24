import { CrawlerController } from './crawler.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { BrowserService } from './service/browser.service';
import { GoogleService } from './service/google.service';
import { PlacesService } from '../places/places.service';

@Module({
  imports: [],
  controllers: [CrawlerController],
  providers: [BrowserService, GoogleService, PlacesService],
})
export class CrawlerModule {}
