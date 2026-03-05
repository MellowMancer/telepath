import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@src/config/prisma/prisma.service';
import { JwtPayload } from './guard.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      // Extract JWT from cookies first, fallback to Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Primary: Extract from cookies
        (req) => req.cookies?.token || null,
        // Fallback: Extract from Authorization Bearer header (for testing/API clients)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // Passport calls this AFTER the token is verified
  async validate(payload: JwtPayload) {
    // Verify user still exists in database
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return null; // Triggers 401 Unauthorized
    }

    // Whatever is returned here is attached to req.user
    return {
      userId: user.id,
      username: user.username,
    };
  }
}