import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './models/chat.model';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { User } from 'src/user/models/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User])],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
