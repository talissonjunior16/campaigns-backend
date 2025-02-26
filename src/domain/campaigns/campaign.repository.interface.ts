import { Campaign } from './../../domain/campaigns/campaign.entity';

export interface ICampaignRepository {
  create(campaign: Campaign): Promise<Campaign>;
  update(campaign: Campaign): Promise<Campaign>;
  findById(id: number): Promise<Campaign | null>;
  findAll(): Promise<Campaign[]>;
  softDelete(id: number): Promise<void>;
}