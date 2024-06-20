import { IsString } from 'class-validator';

export class CreateProfileDto {
    @IsString()
    bio: string;

    @IsString()
    avatar_url: string;

    @IsString()
    type: string;

    @IsString()
    user_id: string;
}
