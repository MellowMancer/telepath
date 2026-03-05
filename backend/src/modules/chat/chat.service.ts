import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/config/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(content: string, senderId: string, roomId: string) {
    return this.prisma.message.create({
      data: { content, senderId, roomId },
      include: { sender: { select: { username: true } } }
    });
  }

  async getMessagesByRoom(roomId: string) {
    return this.prisma.message.findMany({
      where: { roomId },
      include: { sender: { select: { username: true } } },
      orderBy: { createdAt: 'asc' },
      take: 100
    });
  }

  async checkRoomAccess(userId: string, roomId: string): Promise<boolean> {
    const membership = await this.prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });
    return !!membership;
  }
}