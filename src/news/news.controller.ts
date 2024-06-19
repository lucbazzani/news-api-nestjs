import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dtos/createNews.dto';
import { News } from '@prisma/client';
import { UserService } from '../user/user.service';
import { CategoriesService } from '../categories/categories.service';
import { UpdateNewsDto } from './dtos/updateNews.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('news')
export class NewsController {
    constructor(
        private newsService: NewsService,
        private userService: UserService,
        private categoriesService: CategoriesService,
        private prismaService: PrismaService
    ) {}

    @UsePipes(ValidationPipe)
    @Post()
    public async store(@Body() createNews: CreateNewsDto): Promise<News> {
        const { author_id, categories } = createNews;

        const findUserById = await this.userService.findById(author_id);
        if (!findUserById) {
            throw new NotFoundException('Author not found!');
        }

        if (!categories || categories.length < 1) {
            throw new BadRequestException('Category is required!');
        }

        for (const { id } of categories) {
            await this.prismaService.categories
                .findFirstOrThrow({
                    where: { id: id }
                })
                .catch(() => {
                    throw new NotFoundException('Category not found!');
                });
        }

        if (!createNews?.title || !createNews?.content) {
            throw new BadRequestException('Title and Content are required!');
        }

        const newsByTitle = await this.newsService.findByTitle(createNews?.title);
        if (newsByTitle) {
            throw new BadRequestException('Title is not available!');
        }

        const news = await this.newsService.create({
            ...createNews,
            categories: { connect: categories.map(({ id }) => ({ id })) }
        });

        return news;
    }

    @Get()
    public async listAll(): Promise<News[]> {
        const newsList = await this.newsService.findAll();
        return newsList;
    }

    @Get('/:id')
    public async show(@Param('id') id: string): Promise<News> {
        const news = await this.newsService.findById(id);
        if (!news) {
            throw new NotFoundException('News not found!');
        }

        return news;
    }

    @UsePipes(ValidationPipe)
    @Put('/:id')
    public async update(
        @Param('id') id: string,
        @Body() newsData: UpdateNewsDto
    ): Promise<News> {
        if (!newsData) {
            throw new BadRequestException('News data is required!');
        }

        const findNewsById = await this.newsService.findById(id);
        if (!findNewsById) {
            throw new NotFoundException('News not found!');
        }

        const categoryExists = await this.categoriesService.findById(newsData?.category_id);
        if (!categoryExists) {
            throw new NotFoundException('Category not found!');
        }

        const updatedNews = await this.newsService.update({
            id,
            newsData
        });

        return updatedNews;
    }

    @Delete('/:id')
    @HttpCode(204)
    public async delete(@Param('id') id: string): Promise<void> {
        const findNewsById = await this.newsService.findById(id);
        if (!findNewsById) {
            throw new NotFoundException('News not found!');
        }

        await this.newsService.delete(id);
    }
}
