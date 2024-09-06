import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Songs } from './songs.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { DeepPartial } from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  contents: string;

  @Column({ default: "Anonymous" })
  @IsNotEmpty()
  user: string;

  @Column({ default: "123456" })
  @IsNotEmpty()
  password: string;

  @ManyToOne(() => Songs, song => song.id)
  @IsNotEmpty()
  @IsNumber()
  song: DeepPartial<Songs["id"]>

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
