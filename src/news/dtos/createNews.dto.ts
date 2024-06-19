import { Categories } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateNewsDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsString()
    author_id: string;

    categories: Categories[];
}
