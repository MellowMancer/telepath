import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    // Connect to the database when the module is initialized
    await this.$connect();
  }

  async onModuleDestroy() {
    // Gracefully disconnect when the application shuts down
    await this.$disconnect();
  }
}