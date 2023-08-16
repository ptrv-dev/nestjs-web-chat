import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserCreateDto } from 'src/user/dto/user-create.dto';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { User } from 'src/user/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: UserCreateDto): Promise<string> {
    const user = await this.userService.create(dto);
    const token = await this.generateToken(user);
    return token;
  }

  async signIn(dto: SignInDto): Promise<string> {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Incorrect credentials!');

    const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Incorrect credentials!');

    const token = await this.generateToken(user);
    return token;
  }

  private async generateToken(user: User): Promise<string> {
    const payload = { id: user.id, username: user.username, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
