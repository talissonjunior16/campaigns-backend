import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { Campaign } from '../../../domain/campaigns/campaign.entity';
import { ICampaignRepository } from '../../../domain/campaigns/campaign.repository.interface';
import { Category } from './../../../domain/categories/category.entity';
import { CampaignValidatorService } from '../services/campaign-validator.service';


export class CreateCampaignUseCase {
  constructor(
    private readonly campaignRepository: ICampaignRepository,
    private readonly validatorService: CampaignValidatorService
  ) {}

  async execute(dto: CreateCampaignDto): Promise<Campaign> {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    // Validate Dates
    this.validatorService.validateDates(startDate, endDate);

    // Create a new campaign with a numeric id placeholder (0) since the DB will auto-increment it
    const campaign = new Campaign(
      0,
      dto.name,
      startDate,
      endDate,
      new Category(dto.categoryId, "") ,
    );

    return await this.campaignRepository.create(campaign);
  }
}