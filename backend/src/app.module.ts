import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './config/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './modules/chat/chat.gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chat/chat.module';
import { ChatService } from './modules/chat/chat.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // Time window: 60 seconds
      limit: 10,  // Max 10 requests per window
    }]),
    PrismaModule,
    AuthModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [
    ChatGateway,
    AppService,
    ChatService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Apply rate limiting globally
    },
  ]
})
export class AppModule {}