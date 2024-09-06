import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostResponseDto } from './dtos/post-response.dto';
import exp from 'constants';

describe('PostController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            createPost: jest.fn(),
            getAllPosts: jest.fn(),
            getPostById: jest.fn(),
            updatePost: jest.fn(),
            deletePost: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      const createdPost: PostResponseDto = {
        id: 1,
        title: 'Test Post',
        contents: 'This is a test post',
        user: 'tester',
        song: { id: 1 },
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(service, 'createPost').mockResolvedValue(createdPost);

      const result = await controller.createPost(dto);
      expect(result).toEqual(createdPost);
      expect(service.createPost).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllPosts', () => {
    it('should return an array of posts', async () => {
        const posts: PostResponseDto[] = [{
            id: 1,
            title: 'Test Post',
            contents: 'This is a test post',
            user: 'tester',
            song: { id: 1 },
            created_at: new Date(),
            updated_at: new Date(),
          }];
      jest.spyOn(service, 'getAllPosts').mockResolvedValue(posts);

      const result = await controller.getAllPosts();
      expect(result).toEqual(posts);
      expect(service.getAllPosts).toHaveBeenCalled();
    });
  });

  describe('getPostById', () => {
    it('should return a post by id', async () => {
        const post: PostResponseDto = {
            id: 1,
            title: 'Test Post',
            contents: 'This is a test post',
            user: 'tester',
            song: { id: 1 },
            created_at: new Date(),
            updated_at: new Date(),
          };
      jest.spyOn(service, 'getPostById').mockResolvedValue(post);

      const result = await controller.getPostById(1);
      expect(result).toEqual(post);
      expect(service.getPostById).toHaveBeenCalledWith(1);
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      const dto: UpdatePostDto = { title: 'Updated Title', password: 'password123' };
      const expectedResult: PostResponseDto = {
        id: 1,
        title: 'Test Post',
        contents: 'This is a test post',
        user: 'tester',
        song: { id: 1 },
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(service, 'updatePost').mockResolvedValue(expectedResult);

      const result = await controller.updatePost(1, dto);
      expect(result).toEqual(expectedResult);
      expect(service.updatePost).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      jest.spyOn(service, 'deletePost').mockResolvedValue(undefined);

      await controller.deletePost(1, 'password123');
      expect(service.deletePost).toHaveBeenCalledWith(1, 'password123');
    });
  });
});