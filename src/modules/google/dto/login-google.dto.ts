import { StringField } from 'src/decorators';

export class LoginGoogleDto {
  @StringField({})
  email: string;

  @StringField({})
  password: string;
}
