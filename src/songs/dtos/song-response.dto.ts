import { ApiProperty } from "@nestjs/swagger";

export class SongResponseDto {
    @ApiProperty({ description: '생성된 노래의 ID' })
    song_id: number;
  
    @ApiProperty({ description: 'S3 저장소의 노래 파일 접근 링크' })
    link: string;
}