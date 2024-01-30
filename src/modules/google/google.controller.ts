/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleService } from './google.service';
import { CreateScratchDataDto } from './dto/create-scrap-data.dto';

@ApiTags('Google')
@Controller('google')
export class GoogleController {
  constructor(private googleService: GoogleService) {}
  @Get('login')
  loginGoogle() {
    return this.googleService.manyBrowser();
  }

  @Get('create')
  createGoogle() {
    return this.googleService.newBrowserCreateAccount();
  }
  @Get()
  createCrawler(@Query() payload: CreateScratchDataDto) {
    return this.googleService.searchPlacesGoogle(payload);
  }
}
