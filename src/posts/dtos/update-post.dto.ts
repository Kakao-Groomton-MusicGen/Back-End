import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdatePostDto {
    @ApiProperty({ description: '수정할 게시글 제목', required: false })
    @IsString()
    title?: string;
  
    @ApiProperty({ description: '수정할 게시글 내용', required: false })
    @IsString()
    contents?: string;
  
    @ApiProperty({ description: '게시글 비밀번호', minLength: 6 })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}