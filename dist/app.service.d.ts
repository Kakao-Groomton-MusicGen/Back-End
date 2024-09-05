import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class AppService implements OnModuleInit {
    private configService;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    getHello(): string;
}
