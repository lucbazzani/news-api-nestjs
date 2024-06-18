import {
    Body,
    Controller,
    NotFoundException,
    Post,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ) {}

    @UsePipes(ValidationPipe)
    @Post()
    public async login(
        @Body() loginData: LoginDto
    ): Promise<{ accessToken: string }> {
        const findUserByEmail = await this.userService.findByEmail(loginData?.email);

        if (!findUserByEmail) {
            throw new NotFoundException('User not found!');
        }

        return await this.authService.login(loginData, findUserByEmail);
    }
}
