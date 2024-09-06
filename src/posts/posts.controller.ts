import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostResponseDto } from './dtos/post-response.dto';
import { Posts } from '../entities/posts.entity';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @ApiOperation({ summary: '게시글 생성 API' })
    @ApiResponse({ status: 201, description: '게시글 생성 성공', type: PostResponseDto })
    @ApiBody({ type: CreatePostDto })
    async createPost(@Body() createPostDto: CreatePostDto): Promise<PostResponseDto> {
        return this.postsService.createPost(createPostDto);
    }

    @Put(':id')
    @ApiOperation({ summary: '게시글 수정 API' })
    @ApiResponse({ status: 200, description: '게시글 수정 성공', type: PostResponseDto })
    @ApiResponse({ status: 404, description: '게시글 없음' })
    @ApiResponse({ status: 401, description: '비밀번호 불일치' })
    @ApiBody({ type: UpdatePostDto })
    async updatePost(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
        return this.postsService.updatePost(id, updatePostDto);
    }
    
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: '게시글 삭제 API' })
    @ApiParam({ name: 'id', description: '삭제할 게시글 ID' })
    @ApiBody({ schema: { type: 'object', properties: { password: { type: 'string' }}, description: '게시글 비밀번호' }})
    @ApiResponse({ status: 204, description: '게시글 삭제 성공' })
    @ApiResponse({ status: 404, description: '게시글 없음' })
    @ApiResponse({ status: 401, description: '비밀번호 불일치' })
    async deletePost(@Param('id') id: number, @Body('password') password: string): Promise<void> {
        return this.postsService.deletePost(id, password);
    }

    @Get()
    @ApiOperation({ summary: '모든 게시글 조회 API' })
    @ApiResponse({ status: 200, description: '모든 게시글 목록 조회 성공', type: [PostResponseDto] })
    async getAllPosts(): Promise<PostResponseDto[]> {
        return this.postsService.getAllPosts();
    }

    @Get(':id')
    @ApiOperation({ summary: '특정 게시글 조회 API' })
    @ApiParam({ name: 'id', description: '조회할 게시글 ID' })
    @ApiResponse({ status: 200, description: '게시글 조회 성공', type: PostResponseDto })
    @ApiResponse({ status: 404, description: '게시글 없음' })
    async getPostById(@Param('id') id: number): Promise<PostResponseDto> {
        return this.postsService.getPostById(id);
    }
}
