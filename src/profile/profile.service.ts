import { Injectable } from '@nestjs/common';
import { Prisma, Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dtos/createProfile.dto';

@Injectable()
export class ProfileService {
    constructor(private prismaService: PrismaService) {}

    public async create(data: CreateProfileDto): Promise<Profile> {
        const newProfile = await this.prismaService.profile.create({
            data: data,
            include: {
                user: true
            }
        });

        return newProfile;
    }

    public async findById(id: string): Promise<Profile | null> {
        const profile = await this.prismaService.profile.findFirst({
            where: { id: id }
        });
        return profile;
    }

    public async findByUserId(userId: string): Promise<Profile | null> {
        const profile = await this.prismaService.profile.findFirst({
            where: {
                user_id: userId
            }
        });
        return profile;
    }

    public async update(params: {
        id: string;
        data: Prisma.ProfileUpdateInput;
    }): Promise<Profile> {
        const { id, data } = params;
        const updatedProfile = await this.prismaService.profile.update({
            where: { id: id },
            data
        });

        return updatedProfile;
    }

    public async delete(id: string): Promise<Profile> {
        const deletedProfile = await this.prismaService.profile.delete({
            where: { id: id }
        });
        return deletedProfile;
    }
}
