import { Injectable } from "@nestjs/common";

@Injectable()
export class LogService {
  log(message: string) {
    console.log(`[LogService] ${message}`);
  }

  error(message: string, trace?: string) {
    console.error(`[LogService] Error: ${message}`, trace);
  }

  warn(message: string) {
    console.warn(`[LogService] Warning: ${message}`);
  }
  debug(message: string) {
    console.debug(`[LogService] Debug: ${message}`);
  }
  verbose(message: string) {
    console.info(`[LogService] Verbose: ${message}`);
  }
}