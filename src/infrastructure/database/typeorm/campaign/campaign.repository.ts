import { Repository } from 'typeorm';
import { CampaignOrmEntity } from './campaign.orm-entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICampaignRepository } from '../../../../domain/campaigns/campaign.repository.interface';
import { Campaign } from '../../../../domain/campaigns/campaign.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CampaignRepository implements ICampaignRepository {
  constructor(
    @InjectRepository(CampaignOrmEntity)
    private readonly repo: Repository<CampaignOrmEntity>,
  ) {}

  async create(campaign: Campaign): Promise<Campaign> {
    // Map domain entity to ORM entity
    const ormEntity = this.repo.create({
      id: campaign.id,
      name: campaign.name,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      status: campaign.status,
      category: campaign.category
      ? { id: campaign.category.id }
      : undefined,
    });

    const saved = await this.repo.save(ormEntity);

    return plainToInstance(Campaign, saved);
  }

  async update(campaign: Campaign): Promise<Campaign> {
    await this.repo.update(campaign.id, {
      name: campaign.name,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      status: campaign.status,
      category: campaign.category
      ? { id: campaign.category.id, name: campaign.category.name }
      : undefined,
    });

    const updated = await this.repo.findOne({ where: { id: campaign.id } });

    // Only for double check reasons
    if (!updated) {
      throw new NotFoundException('Campanha não encontrada');
    }
    
    return plainToInstance(Campaign, updated);
  }

  async findById(id: number): Promise<Campaign | null> {
    const ormEntity = await this.repo.findOne({
      where: { id },
      relations: ['category'],
    });
  
    return ormEntity ? plainToInstance(Campaign, ormEntity) : null;
  }

  async findAll(): Promise<Campaign[]> {
    const ormEntities = await this.repo.find({
      relations: ['category'],
    });
  
    return ormEntities.map(entity => plainToInstance(Campaign, entity));
  }

  async softDelete(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }
}