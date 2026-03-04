import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: any) {
    // In a real app, use a DTO (Data Transfer Object) for validation
    return this.authService.signup(body.username, body.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Returns 200 instead of 201 Created
  async login(@Body() body: any) {
    return this.authService.login(body.username, body.password);
  }
}