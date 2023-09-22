import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
