import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { BrowserService } from 'src/browser.service';
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [PlacesModule],
  controllers: [GoogleController],
  providers: [GoogleService, BrowserService],
  exports: [GoogleService],
})
export class GoogleModule {}
