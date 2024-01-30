import { TiktokService } from './tiktok.service';
import { TiktokController } from './tiktok.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { GoogleModule } from '../google/google.module';

@Module({
  imports: [GoogleModule],
  controllers: [TiktokController],
  providers: [TiktokService],
})
export class TiktokModule {}
