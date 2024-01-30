import { GoogleModule } from './modules/google/google.module';
import { TiktokModule } from './modules/tiktok/tiktok.module';
import { PlacesModule } from './modules/places/places.module';
import { PrismaModule } from 'nestjs-prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GoogleModule,
    TiktokModule,
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
  ],
  exports: [AppModule],
})
export class AppModule {}
