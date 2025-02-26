import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { ICampaignRepository } from '../../../domain/campaigns/campaign.repository.interface';
import { Campaign } from '../../../domain/campaigns/campaign.entity';
import { NotFoundException } from '@nestjs/common';
import { CampaignStatus } from '../../../domain/campaigns/campaign-status.enum';
import { Category } from '../../../domain/categories/category.entity';
import { CampaignValidatorService } from '../services/campaign-validator.service';

export class UpdateCampaignUseCase {
  constructor(
    private readonly campaignRepository: ICampaignRepository,
    private readonly validatorService: CampaignValidatorService
  ) {}

  async execute(id: number, dto: UpdateCampaignDto): Promise<Campaign> {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      throw new NotFoundException('Campanha não encontrada');
    }

    const parsedStartDate = new Date(dto.startDate);
    const parsedEndDate = new Date(dto.endDate);

    const startDate = dto.startDate ? parsedStartDate : undefined;
    const endDate = dto.endDate ? parsedEndDate : undefined;
    const createdAt = new Date(campaign.createdAt);

    // Validate Dates
    this.validatorService.validateDates(startDate, endDate, createdAt);

    // Update Fields
    campaign.name = dto.name ?? campaign.name;
    campaign.startDate = parsedStartDate ?? campaign.startDate;
    campaign.endDate = parsedEndDate ?? campaign.endDate;

    if (dto.categoryId) {
      campaign.category = new Category(dto.categoryId!, "");
    }

    // Ensure the expiration check is done in UTC
    const currentDate = new Date();
    campaign.status = campaign.endDate < currentDate ? CampaignStatus.EXPIRED : campaign.status;

    return await this.campaignRepository.update(campaign);
  }
}
