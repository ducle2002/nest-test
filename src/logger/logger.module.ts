import { Module } from '@nestjs/common';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';

@Module({
  imports: [],
  controllers: [LoggerController],
  providers: [LoggerService, String],
  exports: [LoggerService],
})
export class LoggerModule {}
