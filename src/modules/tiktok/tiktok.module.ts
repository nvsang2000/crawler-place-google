import { TiktokService } from './tiktok.service';
import { TiktokController } from './tiktok.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [TiktokController],
  providers: [TiktokService],
})
export class TiktokModule {}
