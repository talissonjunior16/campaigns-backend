import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CampaignController } from './web/controllers/campaign.controller';
import { CampaignRepository } from './infrastructure/database/typeorm/campaign/campaign.repository';
import { CreateCampaignUseCase } from './application/campaigns/use-cases/create-campaign.use-case';
import { UpdateCampaignUseCase } from './application/campaigns/use-cases/update-campaign.use-case';
import { GetCampaignUseCase } from './application/campaigns/use-cases/get-campaign.use-case';
import { ListCampaignsUseCase } from './application/campaigns/use-cases/list-campaigns.use-case';
import { DeleteCampaignUseCase } from './application/campaigns/use-cases/delete-campaign-use-case';
import { ListCategoriesUseCase } from './application/categories/use-cases/list-categories.use-case';
import { CategoryRepository } from './infrastructure/database/typeorm/category/category.repository';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CategoryController } from './web/controllers/category.controller';
import { CampaignValidatorService } from './application/campaigns/services/campaign-validator.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
  ],
  controllers: [CampaignController, CategoryController],
  providers: [
    CampaignRepository,
    CategoryRepository,
    CampaignValidatorService,
    {
      provide: DeleteCampaignUseCase,
      useFactory: (campaignRepository: CampaignRepository) =>
        new DeleteCampaignUseCase(campaignRepository),
      inject: [CampaignRepository],
    },
    {
      provide: CreateCampaignUseCase,
      useFactory: (campaignRepository: CampaignRepository, campaignValidatorService: CampaignValidatorService) =>
        new CreateCampaignUseCase(campaignRepository, campaignValidatorService),
      inject: [CampaignRepository, CampaignValidatorService],
    },
    {
      provide: UpdateCampaignUseCase,
      useFactory: (campaignRepository: CampaignRepository, campaignValidatorService: CampaignValidatorService) =>
        new UpdateCampaignUseCase(campaignRepository, campaignValidatorService),
      inject: [CampaignRepository, CampaignValidatorService],
    },
    {
      provide: GetCampaignUseCase,
      useFactory: (campaignRepository: CampaignRepository) =>
        new GetCampaignUseCase(campaignRepository),
      inject: [CampaignRepository],
    },
    {
      provide: ListCampaignsUseCase,
      useFactory: (campaignRepository: CampaignRepository) =>
        new ListCampaignsUseCase(campaignRepository),
      inject: [CampaignRepository],
    },
    // Categories
    {
      provide: ListCategoriesUseCase,
      useFactory: (categoryRepository: CategoryRepository) =>
        new ListCategoriesUseCase(categoryRepository),
      inject: [CategoryRepository],
    },
  ],
})
export class AppModule {}