import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    console.log('DB_HOST:', this.configService.get('DB_HOST'));
    console.log('DB_PORT:', this.configService.get('DB_PORT'));
    console.log('DB_USER:', this.configService.get('DB_USER'));
    console.log('DB_PASSWORD:', this.configService.get('DB_PASSWORD'));
    console.log('DB_NAME:', this.configService.get('DB_NAME'));
  }

  getHello(): string {
    return 'Hello World!';
  }
}
