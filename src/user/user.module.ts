import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { NewsService } from '../news/news.service';
import { ProfileService } from 'src/profile/profile.service';

@Module({
    controllers: [UserController],
    providers: [PrismaService, UserService, NewsService, ProfileService],
    exports: [UserService]
})
export class UserModule {}
