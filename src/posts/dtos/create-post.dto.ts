import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, MinLength } from "class-validator";

export class CreatePostDto {
    @ApiProperty({ description: '게시글 제목' })
    @IsString()
    title: string;
  
    @ApiProperty({ description: '게시글 내용' })
    @IsString()
    content: string;

    @ApiProperty({ description: '게시글 작성자' })
    @IsNotEmpty({ message: '게시글 작성자를 입력해주세요.' })
    @IsString()
    user: string;

    @ApiProperty({ description: '작성자 비밀번호', minLength: 6 })
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: '비밀번호는 6자 이상이어야 합니다.' })
    password: string;

    @ApiProperty({ description: '만든 음악 ID' })
    @IsNotEmpty()
    @IsNumber()
    songId: number;
}