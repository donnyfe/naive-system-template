import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpClientService } from './http-client.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: configService.get('http.timeout', 5000),
        maxRedirects: configService.get('http.maxRedirects', 5),
        retries: configService.get('http.retries', 3),
        retryDelay: configService.get('http.retryDelay', 1000),
        maxConcurrent: configService.get('http.maxConcurrent', 10),
      }),
    }),
  ],
  providers: [HttpClientService],
  exports: [HttpClientService],
})
export class HttpClientModule {}
