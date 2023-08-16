import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserCreateDto } from 'src/user/dto/user-create.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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

  @Get('me')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async getMe(@Request() req) {
    const id = +req.user.id;
    const user = await this.userService.getUserById(id);

    return user;
  }
}
