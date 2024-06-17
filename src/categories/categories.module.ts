import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoriesController } from './categories.controller';
import { NewsService } from 'src/news/news.service';

@Module({
    controllers: [CategoriesController],
    providers: [PrismaService, CategoriesService, NewsService],
    exports: [CategoriesService]
})
export class CategoriesModule {}
