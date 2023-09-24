import {
  BooleanFieldOptional,
  StringField,
  StringFieldOptional,
} from 'src/decorators';

export class CreatePlaceDto {
  @StringField({})
  displayName: string;

  @StringField({})
  phoneNumber?: string;

  @StringFieldOptional({ url: true })
  website?: string;

  @StringFieldOptional({})
  address: string;

  @StringFieldOptional({})
  linkProfile?: any[];

  @BooleanFieldOptional({})
  isActive?: boolean;

  @StringFieldOptional({})
  thumbnailUrl?: string;

  @StringFieldOptional({})
  googleMapId?: string;

  @StringFieldOptional({})
  googleMapLink?: string;

  @StringFieldOptional({})
  scratchLink?: string;

  @StringFieldOptional({})
  categories?: string[];

  @BooleanFieldOptional({})
  googleActived?: boolean;
}
