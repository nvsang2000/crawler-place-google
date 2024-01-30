import { StringField } from 'src/decorators';

export class CreateScratchDataDto {
  @StringField({ swaggerOptions: { example: 'Restaurant' } })
  term?: string;

  @StringField({ swaggerOptions: { example: 'TP Hồ Chí Minh' } })
  where?: string;
}
