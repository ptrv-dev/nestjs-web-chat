import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './models/message.model';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UserModule, ChatModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
