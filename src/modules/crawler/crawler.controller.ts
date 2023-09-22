/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleService } from './service/google.service';
import { CreateScapDataDto } from './dto/create-scrap-data.dto';

@ApiTags('Crawler Place Google')
@Controller('crawler')
export class CrawlerController {
  constructor(private googleService: GoogleService) {}

  @Get()
  createCrawler(@Param() payload: CreateScapDataDto) {
    return this.googleService.searchPlaceseGoogle(payload);
  }
}
