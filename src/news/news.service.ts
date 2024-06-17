import { Injectable } from '@nestjs/common';
import { News, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NewsService {
    constructor(private prismaService: PrismaService) {}

    public async create(newsData: Prisma.NewsUncheckedCreateInput): Promise<News> {
        const news = await this.prismaService.news.create({
            data: newsData
        });

        return news;
    }

    public async findAll(): Promise<News[]> {
        const newsList = this.prismaService.news.findMany();
        return newsList;
    }

    public async findById(id: string): Promise<News | null> {
        const newsById = await this.prismaService.news.findFirst({
            where: { id: id }
        });

        return newsById;
    }

    public async findByTitle(title: string): Promise<News | null> {
        const news = await this.prismaService.news.findFirst({
            where: { title: title }
        });

        return news;
    }

    public async findByCategory(category_id: string): Promise<News[]> {
        const findNewsByCategory = await this.prismaService.news.findMany({
            where: { category_id: category_id }
        });

        return findNewsByCategory;
    }
}
