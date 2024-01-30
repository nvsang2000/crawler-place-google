/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleService } from './google.service';
import { CreateScratchDataDto } from './dto/create-scrap-data.dto';
import { AuthService } from './service/auth.service';
import { LoginGoogleDto } from './dto/login-google.dto';

@ApiTags('Google')
@Controller('google')
export class GoogleController {
  constructor(
    private googleService: GoogleService,
    private authSerivce: AuthService,
  ) {}

  @Post('login')
  loginGoogle(@Body() payload: LoginGoogleDto) {
    return this.authSerivce.loginGoogle(payload);
  }

  @Get('create')
  createGoogle() {
    return this.authSerivce.createAccount();
  }

  @Get()
  createCrawler(@Query() payload: CreateScratchDataDto) {
    return this.googleService.searchPlacesGoogle(payload);
  }
}
