import {
    BadGatewayException,
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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { Categories } from '@prisma/client';
import { NewsService } from '../news/news.service';

@Controller('categories')
export class CategoriesController {
    constructor(
        private categoriesService: CategoriesService,
        private newsService: NewsService
    ) {}

    @Get('/:id')
    public async show(@Param('id') id: string): Promise<Categories> {
        const category = await this.categoriesService.findById(id);

        if (!category) {
            throw new NotFoundException('Category not found!');
        }

        return category;
    }

    @UsePipes(ValidationPipe)
    @Post()
    public async store(@Body() createCategory: CreateCategoryDto): Promise<Categories> {
        if (!createCategory?.name) {
            throw new BadRequestException('Name is required!');
        }

        const findCategoryByName = await this.categoriesService.findByName(createCategory.name);

        if (findCategoryByName) {
            throw new BadRequestException('Category name is not available!');
        }

        const newCategory = await this.categoriesService.create(createCategory);
        return newCategory;
    }

    @Get()
    public async listAll(): Promise<Categories[]> {
        const categories = await this.categoriesService.findAll();
        return categories;
    }

    @UsePipes(ValidationPipe)
    @Put('/:id')
    public async update(
        @Body() categoryData: CreateCategoryDto,
        @Param('id') id: string
    ): Promise<Categories> {
        if (!categoryData?.name) {
            throw new BadGatewayException('Name is required!');
        }

        const categoryById = await this.categoriesService.findById(id);
        if (!categoryById) {
            throw new NotFoundException('Category not found!');
        }

        if (categoryData?.name !== categoryById?.name) {
            const categoryByName = await this.categoriesService.findByName(categoryData?.name);

            if (categoryByName) {
                throw new BadRequestException('Name not available!');
            }
        } else {
            throw new BadRequestException('Category already has the name entered!');
        }

        const categoryUpdated = await this.categoriesService.update({
            id: id,
            data: categoryData
        });

        return categoryUpdated;
    }

    @Delete('/:id')
    @HttpCode(204)
    public async delete(@Param('id') id: string): Promise<void> {
        const categoryById = await this.categoriesService.findById(id);
        if (!categoryById) {
            throw new NotFoundException('Category not found!');
        }

        const findCategoryInNews = await this.newsService.findByCategory(id);
        if (findCategoryInNews.length > 0) {
            throw new BadRequestException('Cannot remove a category in use!');
        }

        await this.categoriesService.delete(id);
    }
}
