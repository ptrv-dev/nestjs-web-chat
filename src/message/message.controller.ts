import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { SendMessageDto } from './dto/send-message.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  @UseGuards(AuthGuard)
  async sendMessage(@Body() dto: SendMessageDto, @Request() req) {
    const userId = +req.user.id;
    const message = await this.messageService.sendMessage(
      userId,
      dto.chatId,
      dto.content,
    );

    return { message };
  }
}
