import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './users.entity';
import { Songs } from './songs.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  contents: string;

  @ManyToOne(() => Users, user => user.id)
  user: Users;

  @ManyToOne(() => Songs, song => song.id)
  song: Songs;
}