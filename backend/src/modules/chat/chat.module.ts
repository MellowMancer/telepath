import { Module } from '@nestjs/common';
import { PrismaModule } from '@src/config/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [RoomController],
  providers: [RoomService, ChatGateway, ChatService],
})
export class ChatModule {}