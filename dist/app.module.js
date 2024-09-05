"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const songs_entity_1 = require("./entities/songs.entity");
const users_entity_1 = require("./entities/users.entity");
const posts_entity_1 = require("./entities/posts.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [
                    `env/.env${process.env.NODE_ENV === 'production' ? '.production' : '.development'}`
                ]
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    console.log('DB_HOST:', configService.get('DB_HOST'));
                    console.log('DB_PORT:', configService.get('DB_PORT'));
                    console.log('DB_USER:', configService.get('DB_USER'));
                    console.log('DB_NAME:', configService.get('DB_NAME'));
                    return {
                        type: 'postgres',
                        host: configService.get('DB_HOST'),
                        port: +configService.get('DB_PORT'),
                        username: configService.get('DB_USER'),
                        password: configService.get('DB_PASSWORD'),
                        database: configService.get('DB_NAME'),
                        ssl: {
                            rejectUnauthorized: false,
                        },
                        entities: [songs_entity_1.Songs, users_entity_1.Users, posts_entity_1.Posts],
                        synchronize: true,
                    };
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([songs_entity_1.Songs, users_entity_1.Users, posts_entity_1.Posts]),
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map