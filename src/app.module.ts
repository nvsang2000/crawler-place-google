import { PlacesModule } from './modules/places/places.module';
import { PrismaModule } from 'nestjs-prisma';
import { CrawlerModule } from './modules/crawler/crawler.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [],
      },
    }),
    PlacesModule,
    CrawlerModule,
  ],
  exports: [AppModule],
})
export class AppModule {}
