import { Exclude } from "class-transformer";
import { Category } from "../categories/category.entity";
import { CampaignStatus } from "./../campaigns/campaign-status.enum";

export class Campaign {
  id: number;
  name: string;
  createdAt: Date; // auto-generated on creation
  startDate: Date;
  endDate: Date;
  status: CampaignStatus;
  category: Category;

  @Exclude()
  deletedAt: Date;

  constructor(
    id: number,
    name: string,
    startDate: Date,
    endDate: Date,
    category: Category,
  ) {
    this.id = id;
    this.name = name;
    this.createdAt = new Date();
    this.startDate = startDate;
    this.endDate = endDate;
    this.category = category;
    // Set status based on dates – if endDate < now then expired, else active
    this.status = endDate < new Date() ? CampaignStatus.EXPIRED : CampaignStatus.ACTIVE;
  }
}