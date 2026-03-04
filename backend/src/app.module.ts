import { Module } from '@nestjs/common';
import { PrismaModule } from './config/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './modules/chat/chat.gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [ChatGateway, AppService]
})
export class AppModule {}