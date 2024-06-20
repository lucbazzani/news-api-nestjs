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
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dtos/createProfile.dto';
import { Profile } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { UpdateProfileDto } from './dtos/updateProfile.dto';

@Controller('profiles')
export class ProfileController {
    constructor(
        private profileService: ProfileService,
        private userService: UserService
    ) {}

    @UsePipes(ValidationPipe)
    @Post()
    public async store(@Body() profileData: CreateProfileDto): Promise<Profile> {
        const { user_id } = profileData;
        if (!user_id) {
            throw new BadRequestException('User Id is required!');
        }

        const findUserById = await this.userService.findById(user_id);
        if (!findUserById) {
            throw new NotFoundException('User Id not found!');
        }

        const newProfile = await this.profileService.create(profileData);
        return newProfile;
    }

    @Get('/:id')
    public async show(@Param('id') id: string): Promise<Profile> {
        const profile = await this.profileService.findById(id);

        if (!profile) {
            throw new NotFoundException('Profile not found!');
        }

        return profile;
    }

    @UsePipes(ValidationPipe)
    @Put('/:id')
    public async update(
        @Body() profileData: UpdateProfileDto,
        @Param('id') id: string
    ): Promise<Profile> {
        const profileById = await this.profileService.findById(id);
        if (!profileById) {
            throw new NotFoundException('Profile not found!');
        }
        const profileUpdated = await this.profileService.update({
            id: id,
            data: profileData
        });
        return profileUpdated;
    }

    @Delete('/:id')
    @HttpCode(204)
    public async delete(@Param('id') id: string): Promise<void> {
        const profile = await this.profileService.findById(id);

        if (!profile) {
            throw new NotFoundException('Profile not found!');
        }

        await this.profileService.delete(id);
    }
}
