import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewsService } from 'src/news/news.service';

@Module({
    controllers: [UserController],
    providers: [PrismaService, UserService, NewsService],
    exports: [UserService]
})
export class UserModule {}
