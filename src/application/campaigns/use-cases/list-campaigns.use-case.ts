import { ICampaignRepository } from '../../../domain/campaigns/campaign.repository.interface';
import { Campaign } from '../../../domain/campaigns/campaign.entity';

export class ListCampaignsUseCase {
  constructor(private readonly campaignRepository: ICampaignRepository) {}

  async execute(): Promise<Campaign[]> {
    return await this.campaignRepository.findAll();
  }
}