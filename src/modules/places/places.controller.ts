/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { Response } from 'express';
import { FetchDto } from 'src/dto/fetch.dto';

@ApiTags('Place Google Data')
@Controller('place')
export class PlacesController {
  constructor(private placeService: PlacesService) {}

  @Get()
  paginate(
    @Query() fetchDto: FetchDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    return this.placeService.paginate(fetchDto, res);
  }
}
