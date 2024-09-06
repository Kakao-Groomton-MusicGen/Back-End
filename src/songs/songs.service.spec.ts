import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { of } from 'rxjs';
import { SongsService } from './songs.service';
import { Songs } from '../entities/songs.entity';
import { CreateSongDto } from './dtos/create-song.dto';

describe('SongsService', () => {
  let service: SongsService;
  let mockSongsRepository: Partial<Repository<Songs>>;
  let mockHttpService: Partial<HttpService>;
  let mockConfigService: Partial<ConfigService> & { get: jest.Mock };

  beforeEach(async () => {
    mockSongsRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    mockHttpService = {
      post: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getRepositoryToken(Songs),
          useValue: mockSongsRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSong', () => {
    it('should create a song and return song_id and link', async () => {
      const createSongDto: CreateSongDto = {
        keywords: 'test keywords',
        style: 'test style',
        title: 'test title',
      };

      const mockAiServerUrl = 'http://mock-ai-server.com';
      const mockS3Link = 'http://mock-s3-link.com';
      const mockSavedSong = { id: 1, link: mockS3Link, ...createSongDto };

      mockConfigService.get.mockReturnValue(mockAiServerUrl);
      (mockHttpService.post as jest.Mock).mockReturnValue(of({ data: { link: mockS3Link } }));
      mockSongsRepository.create = jest.fn().mockReturnValue(mockSavedSong);
      mockSongsRepository.save = jest.fn().mockResolvedValue(mockSavedSong);

      const result = await service.createSong(createSongDto);

      expect(mockConfigService.get).toHaveBeenCalledWith('AI_SERVER_URL');
      expect(mockHttpService.post).toHaveBeenCalledWith(mockAiServerUrl, createSongDto);
      expect(mockSongsRepository.create).toHaveBeenCalledWith({
        ...createSongDto,
        link: mockS3Link,
      });
      expect(mockSongsRepository.save).toHaveBeenCalledWith(mockSavedSong);
      expect(result).toEqual({
        song_id: mockSavedSong.id,
        link: mockSavedSong.link,
      });
    });

    it('should throw an error if AI server request fails', async () => {
      const createSongDto: CreateSongDto = {
        keywords: 'test keywords',
        style: 'test style',
        title: 'test title',
      };

      mockConfigService.get.mockReturnValue('http://mock-ai-server.com');
      (mockHttpService.post as jest.Mock).mockImplementation(() => of({ data: {} }));

      await expect(service.createSong(createSongDto)).rejects.toThrow();
    });
  });
});