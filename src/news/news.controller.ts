import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dtos/createNews.dto';
import { News } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { CategoriesService } from 'src/categories/categories.service';

@Controller('news')
export class NewsController {
    constructor(
        private newsService: NewsService,
        private userService: UserService,
        private categoriesService: CategoriesService
    ) {}

    @UsePipes(ValidationPipe)
    @Post()
    public async store(@Body() createNews: CreateNewsDto): Promise<News> {
        const { author_id, category_id } = createNews;

        const findUserById = await this.userService.findById(author_id);
        if (!findUserById) {
            throw new NotFoundException('Author not found!');
        }

        const findCategoryById = await this.categoriesService.findById(category_id);
        if (!findCategoryById) {
            throw new NotFoundException('Category not found!');
        }

        if (!createNews?.title || !createNews?.content) {
            throw new BadRequestException('Title and Content are required!');
        }

        const newsByTitle = await this.newsService.findByTitle(createNews?.title);
        if (newsByTitle) {
            throw new BadRequestException('Title is not available!');
        }

        const news = await this.newsService.create(createNews);
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
}
