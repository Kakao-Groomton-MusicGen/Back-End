import { ApiProperty } from "@nestjs/swagger";

export class PostResponseDto {
    @ApiProperty()
    id: number;
  
    @ApiProperty()
    title: string;
  
    @ApiProperty()
    content: string;
  
    @ApiProperty()
    nickname: string;
  
    @ApiProperty()
    songId: number;
  
    @ApiProperty()
    createdAt: Date;
  
    @ApiProperty()
    updatedAt: Date;
  }