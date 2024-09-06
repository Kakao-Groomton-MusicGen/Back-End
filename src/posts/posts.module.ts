import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { Posts } from "../entities/posts.entity";
import { Songs } from "../entities/songs.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Songs]), HttpModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}