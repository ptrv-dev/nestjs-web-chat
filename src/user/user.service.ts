import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './models/user.model';
import { UserCreateDto } from './dto/user-create.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async create(dto: UserCreateDto) {
    const candidate = await this.getUserByEmail(dto.email);
    if (candidate)
      throw new ConflictException('This email address has already been used!');

    const hash = await bcrypt.hash(dto.password, 8);
    const user = this.userRepository.create({ ...dto, password: hash });
    await this.userRepository.save(user);
    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .select(['user.id', 'user.username', 'user.email'])
      .leftJoinAndSelect('user.chats', 'chats')
      .leftJoinAndSelect('chats.messages', 'messages')
      .limit(5)
      .orderBy('messages.createdAt', 'DESC')
      .getOne();
    return user;
  }

  async searchUserByUsername(username): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { username: Like(`%${username}%`) },
      take: 10,
      select: ['id', 'username', 'email'],
    });
    return users;
  }
}
