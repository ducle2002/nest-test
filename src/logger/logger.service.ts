import { Injectable } from '@nestjs/common';
import 'winston-daily-rotate-file';
import { Logger, createLogger, format, transports } from 'winston';
import * as moment from 'moment';

@Injectable()
export class LoggerService {
  private readonly logger: Logger;

  constructor(label?: string) {
    this.logger = createLogger({
      level: `${process.env.LOG_LEVEL || 'info'}`,
      transports: [
        /* Ghi vào file */
        new transports.DailyRotateFile({
          dirname: 'logs',
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          format: format.combine(
            format.label({
              label: label,
            }),
            format.timestamp({
              format: () => moment().format('DD/MM/YYYY, HH:mm:ss Z'),
            }),
            format.printf((info) => {
              return `${info.timestamp} [${info.label}] [${info.level}]: ${info.message}`;
            }),
          ),
        }),
        /* Ghi ra console */
        new transports.Console({
          format: format.combine(
            format.label({
              label: label,
            }),
            format.timestamp({
              format: () => moment().format('DD/MM/YYYY, HH:mm:ss Z'),
            }),
            format.printf((info) => {
              return `${info.timestamp} [${info.label}] [${info.level}]: ${info.message}`;
            }),
            format.colorize({
              all: true,
            }),
          ),
        }),
      ],
    });
  }

  /**
   * Info logger
   * @param message
   */
  info(message: string): void {
    this.logger.info(message);
  }

  /**
   * Error logger
   * @param message
   * @param meta
   */
  error(message: string, meta: any = undefined): void {
    this.logger.error(message, meta);
  }

  /**
   * Warn logger
   * @param message
   */
  warn(message: string): void {
    this.logger.warn(message);
  }

  /**
   * Debug logger
   * @param message
   */
  debug(message: string): void {
    this.logger.debug(message);
  }

  /**
   * Verbose logger
   * @param message
   */
  verbose(message: string): void {
    this.logger.verbose(message);
  }
}
