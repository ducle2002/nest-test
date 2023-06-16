import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class sendNotiDto {
  @ApiProperty()
  @IsNotEmpty()
  userIds: number[];

  @ApiProperty()
  @IsNotEmpty({ message: 'Tiêu đề của thông báo không được để trống.' })
  @IsString({ message: 'Tiêu đề của thông báo chứa ký tự không hợp lệ.' })
  @MaxLength(255, { message: 'Tiêu đề của thông báo chứa tối đa 255 ký tự.' })
  title: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Nội dung của thông báo không được để trống.' })
  @IsString({ message: 'Nội dung của thông báo chứa ký tự không hợp lệ.' })
  @MaxLength(255, { message: 'Nội dung của thông báo chứa tối đa 255 ký tự.' })
  content: string;

  @ApiProperty()
  @IsOptional()
  action: string;

  @ApiProperty()
  @IsOptional()
  data: {
    [key: string]: string;
  };

}
