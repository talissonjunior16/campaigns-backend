import { ICampaignRepository } from '../../../domain/campaigns/campaign.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { Campaign } from '../../../domain/campaigns/campaign.entity';

export class GetCampaignUseCase {
  constructor(private readonly campaignRepository: ICampaignRepository) {}

  async execute(id: number): Promise<Campaign> {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      throw new NotFoundException('Campanha não encontrada');
    }
    return campaign;
  }
}