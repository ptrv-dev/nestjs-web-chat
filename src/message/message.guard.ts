import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class MessageGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();

    const token = this.extractTokenFromSocket(client);
    if (!token) {
      client.emit('exception', { status: 'error', message: 'Unauthorized' });
      client.disconnect();
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.request['user'] = payload;
    } catch {
      client.emit('exception', { status: 'error', message: 'Unauthorized' });
      client.disconnect();
      return false;
    }

    return true;
  }

  private extractTokenFromSocket(client: Socket) {
    const [type, token] =
      client.request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
