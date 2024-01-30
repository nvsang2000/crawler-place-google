import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { BrowserService } from 'src/browser.service';
import { PlacesModule } from '../places/places.module';
import { AuthService } from './service/auth.service';

@Module({
  imports: [PlacesModule],
  controllers: [GoogleController],
  providers: [GoogleService, AuthService, BrowserService],
  exports: [GoogleService, AuthService],
})
export class GoogleModule {}
