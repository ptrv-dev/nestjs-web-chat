import { IsEmail, IsString, Length } from 'class-validator';

export class UserCreateDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(4, 255)
  username: string;

  @IsString()
  @Length(4, 255)
  password: string;
}
