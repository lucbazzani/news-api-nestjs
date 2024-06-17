import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
    imports: [UserModule, AuthModule, CategoriesModule],
    controllers: [],
    providers: []
})
export class AppModule {}
