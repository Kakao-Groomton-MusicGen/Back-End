import { IsNotEmpty } from 'class-validator';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Songs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    title: string;

    @Column()
    keywords: string;

    @Column()
    style: string;

    @Column({ default: 'https://hackathon-mute-backend.s3.ap-northeast-2.amazonaws.com/test.txt' })
    @IsNotEmpty()
    link: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}