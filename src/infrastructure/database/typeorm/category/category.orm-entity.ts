import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CampaignOrmEntity } from '../campaign/campaign.orm-entity';

@Entity('t_category')
export class CategoryOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => CampaignOrmEntity, campaign => campaign.category)
    campaigns: CampaignOrmEntity[];
}
