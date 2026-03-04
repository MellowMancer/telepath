import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    return new Redis({
      host: 'localhost', // Change to 'redis' if running Nest inside Docker, else 'localhost'
      port: 6379,
    });
  },
};