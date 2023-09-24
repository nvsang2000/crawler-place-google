import { StringField } from 'src/decorators';

export class CreateScapDataDto {
  @StringField({ swaggerOptions: { example: 'Restaurant' } })
  term?: string;

  @StringField({ swaggerOptions: { example: 'TP Hồ Chí Minh' } })
  where?: string;
}
