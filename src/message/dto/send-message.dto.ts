import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsNumber()
  @Min(1)
  chatId: number;

  @IsString()
  @MinLength(1)
  content: string;
}
