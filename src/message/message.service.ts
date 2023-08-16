import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './models/message.model';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  async sendMessage(selfId: number, chatId: number, content: string) {
    const user = await this.userService.getUserById(selfId);
    if (!user)
      throw new BadRequestException("User with specified ID doesn't exist!");
    const chat = await this.chatService.getChatById(chatId);
    if (!chat)
      throw new BadRequestException("Chat with specified ID doesn't exist!");
    if (!chat.users.some((u) => u.id === user.id))
      throw new BadRequestException(
        "User with specified ID isn't in this chat!",
      );

    const message = this.messageRepository.create();
    message.user = user;
    message.chat = chat;
    message.content = content;

    const result = await this.messageRepository.save(message);
    return result;
  }
}
