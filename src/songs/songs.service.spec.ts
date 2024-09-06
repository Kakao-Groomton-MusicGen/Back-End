import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Songs } from '../entities/songs.entity';
import { Repository } from 'typeorm';
import { CreateSongDto } from './dtos/create-song.dto';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('SongsService', () => {
  let service: SongsService;
  let httpService: HttpService;
  let configService: ConfigService;
  let songsRepository: Repository<Songs>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(), // Mock ConfigService
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(), // Mock HttpService
          },
        },
        {
          provide: getRepositoryToken(Songs),
          useClass: Repository, // Mock the repository
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    songsRepository = module.get<Repository<Songs>>(getRepositoryToken(Songs));
  });

  describe('createSong', () => {
    it('should create a song and return song_id and link', async () => {
      const createSongDto: CreateSongDto = {
        title: 'Test Song',
        keywords: 'test, music',
        style: 'pop',
      };

      const mockAiResponse: AxiosResponse<{ link: string }> = {
        data: { link: 'http://mock-s3-link.com' }, // Mocked response from AI server
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined
        },
      };

      const savedSong = {
        id: 1,
        ...createSongDto,
        link: mockAiResponse.data.link,
      };

      const mockAiServerUrl = 'http://mock-ai-server.com';
      const mockAiServerPort = '3000';
      const fullAiServerUrl = `${mockAiServerUrl}:${mockAiServerPort}`;

      // Mocking the configService to return AI server URL and port
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'AI_SERVER_URL') return mockAiServerUrl;
        if (key === 'AI_SERVER_PORT') return mockAiServerPort;
      });

      // Mocking the HTTP POST request to the AI server
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockAiResponse));

      // Mocking the repository save method
      jest.spyOn(songsRepository, 'create').mockReturnValue(savedSong as Songs);
      jest.spyOn(songsRepository, 'save').mockResolvedValue(savedSong as Songs);

      // Act: Call the createSong method
      const result = await service.createSong(createSongDto);

      // Assertions
      expect(httpService.post).toHaveBeenCalledWith(fullAiServerUrl, createSongDto);
      expect(songsRepository.create).toHaveBeenCalledWith({
        ...createSongDto,
        link: mockAiResponse.data.link,
      });
      expect(songsRepository.save).toHaveBeenCalledWith(savedSong);
      expect(result).toEqual({
        song_id: savedSong.id,
        link: savedSong.link,
      });
    });
  });
});