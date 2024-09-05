import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Songs } from './entities/songs.entity';
import { Users } from './entities/users.entity';
import { Posts } from './entities/posts.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `env/.env${process.env.NODE_ENV === 'production' ? '.production' : '.development'}`
      ]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 환경 변수 로그 출력
        console.log('DB_HOST:', configService.get('DB_HOST'));
        console.log('DB_PORT:', configService.get('DB_PORT'));
        console.log('DB_USER:', configService.get('DB_USER'));
        console.log('DB_NAME:', configService.get('DB_NAME'));

        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get<number>('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          ssl: {
            rejectUnauthorized: false, // SSL 인증서를 검증하지 않도록 설정 (보안상 주의)
          },
          entities: [Songs, Users, Posts],
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature([Songs, Users, Posts]),
  ],
})
export class AppModule {}
