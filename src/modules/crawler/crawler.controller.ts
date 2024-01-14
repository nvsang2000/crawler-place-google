/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleService } from './service/google.service';
import { CreateScratchDataDto } from './dto/create-scrap-data.dto';

@ApiTags('Crawler Place Google')
@Controller('crawler')
export class CrawlerController {
  constructor(private googleService: GoogleService) {}

  @Get('login-google')
  loginGoogle() {
    return this.googleService.manyBrowser();
  }

  @Get('create-google')
  createGoogle() {
    return this.googleService.newBrowserCreateAccount();
  }

  @Get()
  createCrawler(@Query() payload: CreateScratchDataDto) {
    return this.googleService.searchPlacesGoogle(payload);
  }
}
