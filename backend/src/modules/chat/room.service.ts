import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  findAll(): string {
    return 'all rooms';
  }
}