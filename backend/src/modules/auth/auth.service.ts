import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../config/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './guard.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Register a new user
  async signup(username: string, pass: string) {
    // 1. Check if user already exists
    const existing = await this.prisma.user.findUnique({ where: { username } });
    if (existing) {
      throw new ConflictException('Username already exists');
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(pass, 10);

    // 3. Save to MongoDB
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Return the user without the password
    const { password, ...result } = user;
    return result;
  }

  /**
   * Validate user and return JWT
   */
  async login(username: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload: JwtPayload = { 
        userId: user.id, 
        username: user.username, 
        role: 'user' 
    };

    return {
      access_token: this.jwtService.sign(payload),
      username: user.username,
      userId: user.id
    };
  }
}