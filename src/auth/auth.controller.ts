import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserCreateDto } from 'src/user/dto/user-create.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() dto: UserCreateDto) {
    const token = await this.authService.signUp(dto);
    return { token };
  }

  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() dto: SignInDto) {
    const token = await this.authService.signIn(dto);
    return { token };
  }

  @Get('test')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async test() {
    return {
      message: 'You are logged in!',
    };
  }
}
