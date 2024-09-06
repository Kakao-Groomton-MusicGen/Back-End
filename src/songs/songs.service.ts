import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateSongDto } from './dtos/create-song.dto';
import { SongResponseDto } from './dtos/song-response.dto';
import { Songs } from '../entities/songs.entity';

@Injectable()
export class SongsService {
    constructor(
        @InjectRepository(Songs)
        private songsRepository: Repository<Songs>,
        private httpService: HttpService,
        private configService: ConfigService,
    ) {}

    async createSong(createSongDto: CreateSongDto): Promise<SongResponseDto> {
        const aiServerUrl = this.configService.get<string>('AI_SERVER_URL');

        const aiResponse = await firstValueFrom(
            this.httpService.post(aiServerUrl, createSongDto)
        );

        const s3Link = aiResponse.data.link;
        const song = this.songsRepository.create({ 
            ...createSongDto,
            link: s3Link,
        });
        const savedSong = await this.songsRepository.save(song);

        return {
            song_id: savedSong.id,
            link: savedSong.link,
        };
    }
}