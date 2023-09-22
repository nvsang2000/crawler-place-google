import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateScapDataDto {
  @IsString()
  @ApiProperty({ example: 'Restaurant' })
  term?: string;

  @IsString()
  @ApiProperty({ example: 'TP Hồ Chí Minh' })
  where?: string;
}
