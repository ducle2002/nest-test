import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class queryNotiTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  userIds: number[];

  @ApiProperty()
  @IsNotEmpty({ message: 'Tiêu đề của thông báo không được để trống.' })
  device: number[];
}
