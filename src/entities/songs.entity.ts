import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}