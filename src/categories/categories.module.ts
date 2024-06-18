import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesController } from './categories.controller';
import { NewsService } from '../news/news.service';

@Module({
    controllers: [CategoriesController],
    providers: [PrismaService, CategoriesService, NewsService],
    exports: [CategoriesService]
})
export class CategoriesModule {}
