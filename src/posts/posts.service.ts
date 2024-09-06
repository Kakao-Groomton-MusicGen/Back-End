import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { Posts } from "../entities/posts.entity";
import { CreatePostDto } from "./dtos/create-post.dto";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { PostResponseDto } from "./dtos/post-response.dto";

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts)
        private postsRepository: Repository<Posts>,
    ) {}

    async createPost(createPostDto: CreatePostDto): Promise<PostResponseDto> {
        const { password, ...rest } = createPostDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const post = this.postsRepository.create({
            ...rest,
            password: hashedPassword,
        });

        return this.postsRepository.save(post);
    }

    async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<Posts> {
        const post = await this.postsRepository.findOne({ where: { id } });

        if (!post) {
            throw new NotFoundException(`Post with id: ${id} not found`);
        }

        if (!await bcrypt.compare(updatePostDto.password, post.password)) {
            throw new UnauthorizedException('Invalid password');
        }

          const { password, ...rest } = updatePostDto;
          Object.assign(post, rest);

        return this.postsRepository.save(post);
    }

    deletePost = async (id: number, password: string): Promise<void> => {
        const post = await this.postsRepository.findOne({ where: { id } });

        if (!post) {
            throw new NotFoundException(`Post with id: ${id} not found`);
        }

        if (!await bcrypt.compare(password, post.password)) {
            throw new UnauthorizedException('Invalid password');
        }

        await this.postsRepository.remove(post);
    }

    async getPostById(id: number): Promise<PostResponseDto> {
        const post = await this.postsRepository.findOne({ where: { id } });

        if (!post) {
            throw new NotFoundException(`Post with id: ${id} not found`);
        }

        return this.toResponseDto(post);
    }

    async getAllPosts(): Promise<Posts[]> {
        return this.postsRepository.find();
    }

    private toResponseDto(post: Posts): PostResponseDto {
        return {
          id: post.id,
          title: post.title,
          contents: post.contents,
          user: post.user,
          song: { id: post.song.id },
          created_at: post.created_at,
          updated_at: post.updated_at,
        };
      }
}