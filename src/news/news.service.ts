import { Injectable } from '@nestjs/common';
import { News, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNewsDto } from './dtos/updateNews.dto';

@Injectable()
export class NewsService {
    constructor(private prismaService: PrismaService) {}

    public async create(newsData: Prisma.NewsUncheckedCreateInput): Promise<News> {
        const news = await this.prismaService.news.create({
            data: newsData,
            include: {
                author: true,
                categories: true
            }
        });

        return news;
    }

    public async findAll(): Promise<News[]> {
        const newsList = this.prismaService.news.findMany({
            include: {
                author: true,
                categories: true
            }
        });
        return newsList;
    }

    public async findById(id: string): Promise<News | null> {
        const newsById = await this.prismaService.news.findFirst({
            where: { id: id },
            include: {
                author: true,
                categories: true
            }
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
            where: {
                categories: {
                    some: {
                        id: category_id
                    }
                }
            }
        });

        return findNewsByCategory;
    }

    public async findByAuthor(author_id: string): Promise<News[]> {
        const findNewsByAuthor = await this.prismaService.news.findMany({
            where: { author_id: author_id },
            include: {
                categories: true
            }
        });

        return findNewsByAuthor;
    }

    public async update(params: {
        id: string;
        newsData: UpdateNewsDto;
    }): Promise<News> {
        const { id, newsData } = params;
        const { title, content } = newsData;

        const updatedNews = await this.prismaService.news.update({
            where: { id: id },
            data: { title: title, content: content },
            include: {
                author: true,
                categories: true
            }
        });

        return updatedNews;
    }

    public async delete(id: string): Promise<News> {
        const deletedNew = await this.prismaService.news.delete({
            where: { id: id }
        });

        return deletedNew;
    }
}
