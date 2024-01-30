import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { BrowserService } from 'src/browser.service';

@Module({
  imports: [],
  controllers: [PlacesController],
  providers: [PlacesService, BrowserService],
  exports: [PlacesService],
})
export class PlacesModule {}
