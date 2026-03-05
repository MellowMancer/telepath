import { Controller, Get, Post, Body, UseGuards, Request, Param, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@src/config/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ChatService } from './chat.service';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';


@Controller('rooms')
export class RoomController {
  constructor(
    private prisma: PrismaService,
    private chatService: ChatService,
    private roomService: RoomService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAll() {
    // Return all rooms (without showing codes)
    return this.prisma.room.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: { select: { messages: true, members: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createRoomDto: CreateRoomDto, @Request() req) {
    // Generate 4-digit code
    const code = this.roomService.generateCode();

    // Create room with code
    const room = await this.prisma.room.create({
      data: {
        name: createRoomDto.name,
        code: code,
        creatorId: req.user.userId,
      },
    });

    // Add creator as room member
    await this.prisma.roomMember.create({
      data: {
        userId: req.user.userId,
        roomId: room.id
      },
    });

    return room;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async joinRoom(
    @Param('id') roomId: string,
    @Body() body: { code: string },
    @Request() req
  ) {
    return this.roomService.joinRoom(req.user.userId, roomId, body.code);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @Request() req) {
    // Check if user has access to this room
    const hasAccess = await this.chatService.checkRoomAccess(req.user.userId, id);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this room');
    }

    return this.chatService.getMessagesByRoom(id);
  }
}