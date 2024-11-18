import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        console.log(11111111111, configService.get('redis.url'))
        const client = createClient({
          url: configService.get('redis.url'),
          socket: {
            reconnectStrategy: (retries) => {
              if (retries > 10) {
                return new Error('Redis max retries reached');
              }
              return Math.min(retries * 100, 3000);
            },
          },
          database: configService.get('redis.db', 0),
        });

        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
