import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsService } from './posts.service';
import { Posts } from '../entities/posts.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('PostService', () => {
  let service: PostsService;
  let repo: Repository<Posts>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Posts),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repo = module.get<Repository<Posts>>(getRepositoryToken(Posts));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const dto: CreatePostDto = {
        title: 'Test Post',
        contents: 'This is a test post',
        user: 'tester',
        password: 'password123',
        song: { id: 1 },
      };
      const post = { id: 1, ...dto, password: expect.any(String) };
      jest.spyOn(repo, 'create').mockReturnValue(post as Posts);
      jest.spyOn(repo, 'save').mockResolvedValue(post as Posts);

      const result = await service.createPost(dto);
      expect(result).toEqual(post);
    });
  });

  describe('getAllPosts', () => {
    it('should return an array of posts', async () => {
      const posts = [{ id: 1, title: 'Test Post' }];
      jest.spyOn(repo, 'find').mockResolvedValue(posts as Posts[]);

      const result = await service.getAllPosts();
      expect(result).toEqual(posts);
    });
  });

  describe('getPostById', () => {
    it('should return a post if found', async () => {
      const post = { id: 1, title: 'Test Post' };
      jest.spyOn(repo, 'findOne').mockResolvedValue(post as Posts);

      const result = await service.getPostById(1);
      expect(result).toEqual(post);
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.getPostById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePost', () => {
    it('should update a post if password is correct', async () => {
      const post = { id: 1, title: 'Old Title', password: 'hashedPassword' };
      const dto: UpdatePostDto = { title: 'New Title', password: 'correctPassword' };
      jest.spyOn(repo, 'findOne').mockResolvedValue(post as Posts);
      jest.spyOn(repo, 'save').mockResolvedValue({ ...post, ...dto } as Posts);
      
      // Mock bcrypt compare
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.updatePost(1, dto);
      expect(result.title).toEqual(dto.title);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const post = { id: 1, title: 'Old Title', password: 'hashedPassword' };
      const dto: UpdatePostDto = { title: 'New Title', password: 'wrongPassword' };
      jest.spyOn(repo, 'findOne').mockResolvedValue(post as Posts);
      
      // Mock bcrypt compare
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.updatePost(1, dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deletePost', () => {
    it('should delete a post if password is correct', async () => {
      const post = { id: 1, title: 'Test Post', password: 'hashedPassword' };
      jest.spyOn(repo, 'findOne').mockResolvedValue(post as Posts);
      jest.spyOn(repo, 'remove').mockResolvedValue(post as Posts);
      
      // Mock bcrypt compare
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      await expect(service.deletePost(1, 'correctPassword')).resolves.not.toThrow();
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const post = { id: 1, title: 'Test Post', password: 'hashedPassword' };
      jest.spyOn(repo, 'findOne').mockResolvedValue(post as Posts);
      
      // Mock bcrypt compare
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.deletePost(1, 'wrongPassword')).rejects.toThrow(UnauthorizedException);
    });
  });
});