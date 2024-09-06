import { ApiProperty } from "@nestjs/swagger";

export class CreateSongDto {
    @ApiProperty({ description: '노래 생성을 위한 키워드' })
    keywords: string;
  
    @ApiProperty({ description: '노래의 스타일' })
    style: string;
  
    @ApiProperty({ description: '노래의 제목' })
    title: string;
}