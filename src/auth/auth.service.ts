import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserCreateDto } from 'src/user/dto/user-create.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: UserCreateDto): Promise<string> {
    const user = await this.userService.create(dto);
    const payload = { id: user.id, username: user.username, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
