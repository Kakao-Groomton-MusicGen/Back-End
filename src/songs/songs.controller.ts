import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { SongsService } from "./songs.service";
import { CreateSongDto } from "./dtos/create-song.dto";
import { SongResponseDto } from "./dtos/song-response.dto";
import e from "express";

@ApiTags('songs')
@Controller('songs')
export class SongsController {
    constructor(private readonly songsService: SongsService) {}

    @Post()
    @ApiOperation({ summary: 'AI 노래 생성 API' })
    @ApiResponse({ status: 201, description: '노래 생성 성공', type: SongResponseDto })
    async createSong(@Body() createSongDto: CreateSongDto): Promise<SongResponseDto> {
        return this.songsService.createSong(createSongDto);
    }
}