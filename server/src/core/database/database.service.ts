import { Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LoggerService } from '@/core/logger/logger.service';

@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private dataSource: DataSource,
    private logger: LoggerService
  ) {}

  async onModuleInit() {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        this.logger.log('Database connection initialized');
      }
    } catch (error) {
      this.logger.error('Failed to initialize database connection', error);
      throw error;
    }
  }

  async onApplicationShutdown() {
    try {
      if (this.dataSource?.isInitialized) {
        await this.dataSource.destroy();
        this.logger.log('Database connection closed');
      }
    } catch (error) {
      this.logger.error('Failed to close database connection', error);
      throw error;
    }
  }

  getDataSource(): DataSource {
    if (!this.dataSource?.isInitialized) {
      throw new Error('Database connection is not initialized');
    }
    return this.dataSource;
  }
}
