import { Categories } from '@prisma/client';
import { IsString } from 'class-validator';

export class UpdateNewsDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    categories: Categories[];
}
