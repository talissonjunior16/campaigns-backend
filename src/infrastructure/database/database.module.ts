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
                    
                    try {
                         // Get query runner for manual queries
                        const queryRunner = AppDataSource.createQueryRunner();
                        await queryRunner.connect();

                        // Check if categories already exist
                        const categoryCount = await queryRunner.query(`SELECT COUNT(*) FROM t_category`);

                        if (Number(categoryCount[0].count) === 0) {
                            console.log('Seeding categories...');
                            await queryRunner.query(`
                                INSERT INTO t_category (id,name) VALUES 
                                (1, 'Eletronicos'),
                                (2, 'Moda'),
                                (3, 'Esportes'),
                                (4, 'Alimentos'),
                                (5, 'Serviços');
                            `);
                            console.log('Categories seeded successfully!');
                        } else {
                            console.log('Categories already exist, skipping seed.');
                        }

                        await queryRunner.release(); // Close connection
                    }
                    catch {}
                }

                return AppDataSource.options;
            },
        }),
        TypeOrmModule.forFeature([CampaignOrmEntity, CategoryOrmEntity]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }