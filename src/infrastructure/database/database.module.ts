import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CampaignOrmEntity } from './typeorm/campaign/campaign.orm-entity';
import { CategoryOrmEntity } from './typeorm/category/category.orm-entity';
import AppDataSource from './data-source';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async () => {
                if (!AppDataSource.isInitialized) {
                    await AppDataSource.initialize();
                }
                return AppDataSource.options;
            },
        }),
        TypeOrmModule.forFeature([CampaignOrmEntity, CategoryOrmEntity]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }