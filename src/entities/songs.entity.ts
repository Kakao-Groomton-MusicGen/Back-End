import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Songs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    keywords: string;

    @Column()
    style: string;

    @Column()
    link: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}