import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '@src/modules/auth/jwt.guard';

@Controller('rooms')
export class RoomController {
  
  @UseGuards(JwtAuthGuard) // Passport handles the entire check
  @Post()
  async createRoom(@Request() req) {
    // req.user is automatically populated by JwtStrategy.validate()
    const user = req.user; 
    console.log(`User ${user.username} is creating a room`);
    
    // ... logic
  }
}