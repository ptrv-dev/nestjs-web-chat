import { IsNumber, Min } from 'class-validator';

export class ChatCreateDto {
  @IsNumber()
  @Min(1)
  userId: number;
}
