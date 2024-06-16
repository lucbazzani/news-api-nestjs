import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { Users } from '@prisma/client';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/:id')
    public async show(@Param('id') id: string): Promise<Users> {
        const user = await this.userService.findById(id);

        if (!user) {
            throw new NotFoundException('User not found!');
        }

        return user;
    }

    @Post()
    public async store(@Body() createUser: CreateUserDto): Promise<Users> {
        if (!createUser?.name || !createUser?.email || !createUser?.password) {
            throw new BadRequestException('Name, e-mail and password are required!');
        }

        const userByEmail = await this.userService.findByEmail(createUser?.email);

        if (userByEmail) {
            throw new BadRequestException('E-mail is not available!');
        }

        const newUser = await this.userService.create(createUser);
        return newUser;
    }
}
