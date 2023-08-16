import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatCreateDto } from './dto/chat-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() dto: ChatCreateDto, @Request() req) {
    const selfId = +req.user.id;
    const userId = dto.userId;

    const chat = await this.chatService.create(selfId, userId);

    return chat;
  }
}
