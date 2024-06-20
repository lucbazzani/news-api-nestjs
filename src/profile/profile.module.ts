import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
    controllers: [ProfileController],
    providers: [PrismaService, ProfileService, UserService],
    exports: [ProfileService]
})
export class ProfileModule {}
