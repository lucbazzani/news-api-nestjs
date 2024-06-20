import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { NewsModule } from './news/news.module';
import { ProfileModule } from './profile/profile.module';

@Module({
    imports: [
        UserModule,
        AuthModule,
        CategoriesModule,
        NewsModule,
        ProfileModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
