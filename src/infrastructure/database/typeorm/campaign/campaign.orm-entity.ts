import { CampaignStatus } from '../../../../domain/campaigns/campaign-status.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne, BeforeInsert, BeforeRemove } from 'typeorm';
import { CategoryOrmEntity } from '../category/category.orm-entity';

@Entity('t_campaign')
export class CampaignOrmEntity {
  @PrimaryGeneratedColumn()
  
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.ACTIVE,
  })
  status: CampaignStatus;

  @ManyToOne(() => CategoryOrmEntity, category => category.campaigns)
  @JoinColumn({ name: 'fk_category_id' })
  category: CategoryOrmEntity;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @BeforeInsert()
  insertCreated() {
    this.createdAt = new Date();
  }

  @BeforeRemove()
  removeCreated() {
    this.deletedAt = new Date();
  }

}