import { ApiProperty } from "@nestjs/swagger";
import { Songs } from "src/entities/songs.entity";
import { DeepPartial } from "typeorm";

export class PostResponseDto {
    @ApiProperty()
    id: number;
  
    @ApiProperty()
    title: string;
  
    @ApiProperty()
    contents: string;
  
    @ApiProperty()
    user: string;
  
    @ApiProperty()
    song: DeepPartial<Songs>;
  
    @ApiProperty()
    created_at: Date;
  
    @ApiProperty()
    updated_at: Date;
  }