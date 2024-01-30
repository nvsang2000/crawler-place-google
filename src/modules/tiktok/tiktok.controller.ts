/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TiktokService } from './tiktok.service';

@ApiTags('Tiktok')
@Controller('tiktok')
export class TiktokController {
  constructor(private tiktokService: TiktokService) {}
  @Get()
  getLogin() {
    console.log('hello tiktok');
  }
}
