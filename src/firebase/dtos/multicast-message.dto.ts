import { IsNotEmpty } from 'class-validator';

export class MulticastMessageDto {
  @IsNotEmpty()
  deviceTokens: string[];

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  data: {
    [key: string]: string;
  };
}
