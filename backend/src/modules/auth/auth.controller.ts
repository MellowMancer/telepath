import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    const result = await this.authService.signup(signupDto.username, signupDto.password);

    // Return success message - user needs to login
    res.status(HttpStatus.CREATED).json({
      message: 'Account created successfully. Please login.',
      userId: result.id,
      username: result.username,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(loginDto.username, loginDto.password);

    // Set JWT in HTTP-only cookie
    res.cookie('token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400000, // 1 day
      path: '/',
    });

    // Return user info without token
    res.json({
      userId: result.userId,
      username: result.username,
    });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    // Clear the JWT cookie
    res.clearCookie('token', {
      httpOnly: true,
      path: '/',
    });

    res.json({ message: 'Logged out successfully' });
  }
}