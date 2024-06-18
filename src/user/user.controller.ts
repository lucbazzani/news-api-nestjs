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
import { CreateUserDto } from './dtos/createUser.dto';
import { Users } from '@prisma/client';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { NewsService } from '../news/news.service';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
        private newsService: NewsService
    ) {}

    @Get('/:id')
    public async show(@Param('id') id: string): Promise<Users> {
        const user = await this.userService.findById(id);

        if (!user) {
            throw new NotFoundException('User not found!');
        }

        return user;
    }

    @UsePipes(ValidationPipe)
    @Post()
    public async store(@Body() createUser: CreateUserDto): Promise<Users> {
        if (!createUser?.name || !createUser?.email || !createUser?.password) {
            throw new BadRequestException(
                'Name, e-mail and password are required!'
            );
        }

        const userByEmail = await this.userService.findByEmail(
            createUser?.email
        );

        if (userByEmail) {
            throw new BadRequestException('E-mail is not available!');
        }

        const newUser = await this.userService.create(createUser);
        return newUser;
    }

    @UsePipes(ValidationPipe)
    @Put('/:id')
    public async update(
        @Body() userData: UpdateUserDto,
        @Param('id') id: string
    ): Promise<Users> {
        if (!userData?.name || !userData?.email) {
            throw new BadRequestException('Name and Email are required!');
        }

        const userById = await this.userService.findById(id);
        if (!userById) {
            throw new NotFoundException('User not found!');
        }

        const userByEmail = await this.userService.findByEmail(userData?.email);
        if (userByEmail && userByEmail?.id !== id) {
            throw new BadRequestException('E-mail not available!');
        }

        const updatedUser = await this.userService.update({
            id: id,
            data: userData
        });
        return updatedUser;
    }

    @Delete('/:id')
    @HttpCode(204)
    public async delete(@Param('id') id: string): Promise<void> {
        const user = await this.userService.findById(id);

        if (!user) {
            throw new NotFoundException('User not found!');
        }

        const findAuthorInNews = await this.newsService.findByAuthor(id);
        if (findAuthorInNews.length > 0) {
            throw new BadRequestException('Cannot remove a user who has news authored!');
        }

        await this.userService.delete(id);
    }
}
