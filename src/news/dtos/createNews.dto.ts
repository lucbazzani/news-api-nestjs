import { IsString } from 'class-validator';

export class CreateNewsDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsString()
    author_id: string;

    @IsString()
    category_id: string;
}
