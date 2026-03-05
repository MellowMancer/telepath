import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from handshake auth or headers
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        throw new WsException('Authentication token not provided');
      }

      // Verify JWT token
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(token, { secret });

      // Attach user info to socket for later use
      client.data.user = {
        userId: payload.userId,
        username: payload.username,
      };

      console.log(`WebSocket client connected: ${payload.username} (${payload.userId})`);
    } catch (error) {
      console.error('WebSocket authentication failed:', error.message);
      client.disconnect();
    }
  }

  @SubscribeMessage('join_room')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
    if (!client.data.user) {
      throw new WsException('Unauthorized');
    }
    client.join(roomId);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { content: string; roomId: string },
  ) {
    // Verify user is authenticated
    if (!client.data.user) {
      throw new WsException('Unauthorized');
    }

    // Extract userId from authenticated socket (NOT from client data)
    const userId = client.data.user.userId;

    // Check if user has access to the room
    const hasAccess = await this.chatService.checkRoomAccess(userId, data.roomId);
    if (!hasAccess) {
      throw new WsException('You do not have access to this room');
    }

    // 1. Persist to DB
    const sentMsg = await this.chatService.sendMessage(data.content, userId, data.roomId);

    // 2. Broadcast to specific room
    this.server.to(data.roomId).emit('new_message', sentMsg);
  }
}