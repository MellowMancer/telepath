import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { PrismaService } from '@src/config/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/create-room.dto';


@Controller('rooms')
export class RoomController {
  constructor(private prisma: PrismaService, private chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAll() {
    return this.prisma.room.findMany({
      include: { _count: { select: { messages: true } } }
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createRoomDto: CreateRoomDto, @Request() req) {
    // Create room and add creator as member with owner role
    const room = await this.prisma.room.create({
      data: {
        name: createRoomDto.name,
        creatorId: req.user.userId,
      },
    });

    // Add creator as room member with owner role
    await this.prisma.roomMember.create({
      data: {
        userId: req.user.userId,
        roomId: room.id,
        role: 'owner',
      },
    });

    return room;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @Request() req) {
    // Check if user has access to this room
    const hasAccess = await this.chatService.checkRoomAccess(req.user.userId, id);
    if (!hasAccess) {
      throw new Error('You do not have access to this room');
    }

    return this.chatService.getMessagesByRoom(id);
  }
}