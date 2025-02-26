import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CampaignValidatorService {
  validateDates(startDate?: Date, endDate?: Date, createdAt?: Date) {
    let creationDate = new Date();

    if (createdAt) {
      creationDate = createdAt;
    }

    if (startDate && startDate.getTime() < creationDate.getTime()) {
      throw new BadRequestException(
        'A data de início deve ser igual ou posterior à data atual no momento da criação.'
      );
    }

    if (startDate && endDate && endDate.getTime() <= startDate.getTime()) {
      throw new BadRequestException(
        'A data fim deve ser maior que a data de início.'
      );
    }
  }
}
