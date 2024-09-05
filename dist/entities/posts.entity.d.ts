import { Users } from './users.entity';
import { Songs } from './songs.entity';
export declare class Posts {
    id: number;
    title: string;
    contents: string;
    user: Users;
    song: Songs;
}
