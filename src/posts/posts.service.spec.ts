// import { Test, TestingModule } from '@nestjs/testing';
// import { PostsService } from './posts.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Posts } from '../entities/posts.entity';
// import { Songs } from '../entities/songs.entity';
// import { Repository } from 'typeorm';
// import { CreatePostDto } from './dtos/create-post.dto';
// import { UpdatePostDto } from './dtos/update-post.dto';
// import * as bcrypt from 'bcrypt';
// import { NotFoundException, UnauthorizedException } from '@nestjs/common';

// describe('PostsService', () => {
//   let service: PostsService;
//   let postsRepo: Repository<Posts>;
//   let songsRepo: Repository<Songs>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         PostsService,
//         {
//           provide: getRepositoryToken(Posts),
//           useClass: Repository,
//         },
//         {
//           provide: getRepositoryToken(Songs),
//           useClass: Repository,
//         },
//       ],
//     }).compile();

//     service = module.get<PostsService>(PostsService);
//     postsRepo = module.get<Repository<Posts>>(getRepositoryToken(Posts));
//     songsRepo = module.get<Repository<Songs>>(getRepositoryToken(Songs));
//   });

//   describe('createPost', () => {
//     it('should create a post and return response', async () => {
//       const createPostDto: CreatePostDto = {
//         title: 'Test Post',
//         contents: 'Test Contents',
//         user: 'testUser',
//         password: 'password123',
//         song: 1,
//       };

//       const mockSong = { id: 1 };
//       const mockPost = { id: 1, ...createPostDto, password: 'hashedPassword', song: mockSong.id };

//       jest.spyOn(songsRepo, 'findOne').mockResolvedValue(mockSong as Songs);
//       jest.spyOn(bcrypt, 'hash' as any).mockResolvedValue('hashedPassword');
//       jest.spyOn(postsRepo, 'create').mockReturnValue(mockPost as unknown as Posts);
//       jest.spyOn(postsRepo, 'save').mockResolvedValue(mockPost as Posts);

//       const result = await service.createPost(createPostDto);

//       expect(result).toEqual({
//         id: 1,
//         title: 'Test Post',
//         contents: 'Test Contents',
//         user: 'testUser',
//         song: 1,
//         created_at: undefined,
//         updated_at: undefined,
//       });
//       expect(songsRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
//       expect(postsRepo.create).toHaveBeenCalledWith({
//         ...createPostDto,
//         password: 'hashedPassword',
//         song: 1,
//       });
//       expect(postsRepo.save).toHaveBeenCalledWith(mockPost);
//     });

//     it('should throw NotFoundException if song is not found', async () => {
//       const createPostDto: CreatePostDto = {
//         title: 'Test Post',
//         contents: 'Test Contents',
//         user: 'testUser',
//         password: 'password123',
//         song: 999,
//       };

//       jest.spyOn(songsRepo, 'findOne').mockResolvedValue(null);

//       await expect(service.createPost(createPostDto)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('updatePost', () => {
//     it('should update a post if password is correct', async () => {
//       const updatePostDto: UpdatePostDto = { title: 'Updated Post', password: 'password123' };
//       const mockPost = { id: 1, title: 'Test Post', password: 'hashedPassword' };

//       jest.spyOn(postsRepo, 'findOne').mockResolvedValue(mockPost as Posts);
//       jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
//       jest.spyOn(postsRepo, 'save').mockResolvedValue({ ...mockPost, ...updatePostDto });

//       const result = await service.updatePost(1, updatePostDto);

//       expect(result.title).toEqual('Updated Post');
//       expect(postsRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
//       expect(bcrypt.compare).toHaveBeenCalledWith(updatePostDto.password, 'hashedPassword');
//       expect(postsRepo.save).toHaveBeenCalledWith({ ...mockPost, ...updatePostDto });
//     });

//     it('should throw UnauthorizedException if password is incorrect', async () => {
//       const updatePostDto: UpdatePostDto = { title: 'Updated Post', password: 'wrongPassword' };
//       const mockPost = { id: 1, title: 'Test Post', password: 'hashedPassword' };

//       jest.spyOn(postsRepo, 'findOne').mockResolvedValue(mockPost as Posts);
//       jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

//       await expect(service.updatePost(1, updatePostDto)).rejects.toThrow(UnauthorizedException);
//     });
//   });

//   describe('deletePost', () => {
//     it('should delete a post if password is correct', async () => {
//       const mockPost = { id: 1, title: 'Test Post', password: 'hashedPassword' };

//       jest.spyOn(postsRepo, 'findOne').mockResolvedValue(mockPost as Posts);
//       jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
//       jest.spyOn(postsRepo, 'remove').mockResolvedValue(mockPost as Posts);

//       await service.deletePost(1, 'password123');

//       expect(postsRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
//       expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
//       expect(postsRepo.remove).toHaveBeenCalledWith(mockPost);
//     });

//     it('should throw UnauthorizedException if password is incorrect', async () => {
//       const mockPost = { id: 1, title: 'Test Post', password: 'hashedPassword' };

//       jest.spyOn(postsRepo, 'findOne').mockResolvedValue(mockPost as Posts);
//       jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

//       await expect(service.deletePost(1, 'wrongPassword')).rejects.toThrow(UnauthorizedException);
//     });
//   });

//   describe('getPostById', () => {
//     it('should return a post by id', async () => {
//       const mockPost = {
//         id: 1,
//         title: 'Test Post',
//         contents: 'Test Contents',
//         user: 'testUser',
//         song: { id: 1 },
//         created_at: new Date(),
//         updated_at: new Date(),
//       };

//       jest.spyOn(postsRepo, 'findOne').mockResolvedValue(mockPost as Posts);

//       const result = await service.getPostById(1);

//       expect(result).toEqual({
//         id: 1,
//         title: 'Test Post',
//         contents: 'Test Contents',
//         user: 'testUser',
//         song: { id: 1 },
//         created_at: mockPost.created_at,
//         updated_at: mockPost.updated_at,
//       });
//     });

//     it('should throw NotFoundException if post not found', async () => {
//       jest.spyOn(postsRepo, 'findOne').mockResolvedValue(null);

//       await expect(service.getPostById(1)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('getAllPosts', () => {
//     it('should return an array of posts', async () => {
//       const mockPosts = [
//         {
//           id: 1,
//           title: 'Test Post',
//           contents: 'Test Contents',
//           user: 'testUser',
//           song: { id: 1 },
//           created_at: new Date(),
//           updated_at: new Date(),
//         },
//       ];

//       jest.spyOn(postsRepo, 'find').mockResolvedValue(mockPosts as Posts[]);

//       const result = await service.getAllPosts();

//       expect(result).toEqual(
//         mockPosts.map((post) => ({
//           id: post.id,
//           title: post.title,
//           contents: post.contents,
//           user: post.user,
//           song: post.song,
//           created_at: post.created_at,
//           updated_at: post.updated_at,
//         }))
//       );
//     });
//   });
// });