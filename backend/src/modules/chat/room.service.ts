import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/config/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate a random 4-digit room code
   */
  generateCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  /**
   * Validate room code and return room if valid
   */
  async validateCode(code: string) {
    return this.prisma.room.findFirst({
      where: { code },
      include: { _count: { select: { messages: true, members: true } } },
    });
  }

  /**
   * Join a room with code validation
   */
  async joinRoom(userId: string, roomId: string, code: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.code !== code) {
      throw new BadRequestException('Invalid room code');
    }

    // Check if user is already a member
    const existingMember = await this.prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId: room.id,
        },
      },
    });

    if (existingMember) {
      return { success: true, message: 'Already a member', room };
    }

    // Add user as room member
    await this.prisma.roomMember.create({
      data: {
        userId,
        roomId: room.id,
      },
    });

    return { success: true, message: 'Joined successfully', room };
  }

  findAll(): string {
    return 'all rooms';
  }
}