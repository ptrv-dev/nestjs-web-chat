import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto } from 'src/user/dto/user-create.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() dto: UserCreateDto) {
    const token = await this.authService.signUp(dto);
    return { token };
  }

  @Post('sign-in')
  async signIn(@Body() dto: SignInDto) {
    const token = await this.authService.signIn(dto);
    return { token };
  }
}
