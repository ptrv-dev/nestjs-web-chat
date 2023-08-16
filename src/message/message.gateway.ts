import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { UseGuards } from '@nestjs/common';
import { MessageGuard } from './message.guard';
import { MessageService } from './message.service';

@WebSocketGateway({ namespace: 'message' })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  @WebSocketServer()
  server: Server;

  users = new Map<number, string>();

  async handleConnection(client: Socket) {
    const token = this.extractTokenFromSocket(client);
    if (!token) return this.sendUnauthorized(client);

    try {
      const payload = await this.jwtService.verifyAsync(token);
      this.users.set(payload.id, client.id);
      return client.emit('info', {
        status: 'connected',
        message: 'Connection established!',
      });
    } catch {
      return this.sendUnauthorized(client);
    }
  }

  async handleDisconnect(client: Socket) {
    const token = this.extractTokenFromSocket(client);
    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token);
        this.users.delete(payload.id);
      } catch {}
    }
  }

  @UseGuards(MessageGuard)
  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any) {
    payload = JSON.parse(payload);
    const user = client.request['user'];
    if (!payload || !payload.chatId || !payload.content)
      throw new WsException('Bad request');

    const chat = await this.chatService.getChatById(payload.chatId);
    if (!chat) throw new WsException("Chat with specified ID doesn't exist");
    if (!chat.users.some((u) => u.id === user.id))
      throw new WsException("You aren't a member of this chat");

    const message = await this.messageService.sendMessage(
      user.id,
      payload.chatId,
      payload.content,
    );

    chat.users.forEach((u) => {
      const client = this.users.get(u.id);
      if (client) {
        this.server
          .to(client)
          .emit('message', { status: 'new_message', chat: chat.id, message });
      }
    });
  }

  private sendUnauthorized(client: Socket) {
    client.emit('exception', { status: 'error', message: 'Unauthorized' });
    return client.disconnect();
  }

  private extractTokenFromSocket(client: Socket) {
    const [type, token] =
      client.request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
