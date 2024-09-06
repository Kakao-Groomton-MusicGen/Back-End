import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { Songs } from '../entities/songs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Songs]), HttpModule],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}