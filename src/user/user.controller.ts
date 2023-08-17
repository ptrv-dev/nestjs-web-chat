import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async searchUsers(@Query('username') username: string) {
    const users = await this.userService.searchUserByUsername(username);
    return users;
  }
}
