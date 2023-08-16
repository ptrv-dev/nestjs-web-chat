import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './models/chat.model';
import { User } from 'src/user/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(selfId: number, userId: number): Promise<Chat> {
    const self = await this.userRepository.findOneBy({ id: selfId });
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!self || !user)
      throw new BadRequestException("User with specified ID doesn't exists!");

    const chat = this.chatRepository.create();
    chat.users = [self, user];

    await this.chatRepository.save(chat);
    return chat;
  }

  async getChatById(chatId: number): Promise<Chat | null> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: {
        users: true,
      },
    });
    return chat;
  }
}
