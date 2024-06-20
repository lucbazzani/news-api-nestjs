import { IsString } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    bio: string;

    @IsString()
    avatar_url: string;
}
