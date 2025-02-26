import { ICampaignRepository } from '../../../domain/campaigns/campaign.repository.interface';
import { NotFoundException } from '@nestjs/common';

export class DeleteCampaignUseCase {
  constructor(private readonly campaignRepository: ICampaignRepository) {}

  async execute(id: number): Promise<void> {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      throw new NotFoundException('Campanha não encontrada');
    }

    await this.campaignRepository.softDelete(id);
  }
}