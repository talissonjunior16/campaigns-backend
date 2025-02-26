import { CreateCampaignUseCase } from '../../src/application/campaigns/use-cases/create-campaign.use-case';
import { ICampaignRepository } from '../../src/domain/campaigns/campaign.repository.interface';
import { CreateCampaignDto } from '../../src/application/campaigns/dto/create-campaign.dto';
import { Campaign } from '../../src/domain/campaigns/campaign.entity';
import { BadRequestException } from '@nestjs/common';
import { CampaignValidatorService } from '../../src/application/campaigns/services/campaign-validator.service';
import { Category } from '../../src/domain/categories/category.entity';

describe('Caso de Uso: Criar Campanha', () => {
  let createCampaignUseCase: CreateCampaignUseCase;
  let mockCampaignRepository: jest.Mocked<ICampaignRepository>;
  let mockValidatorService: jest.Mocked<CampaignValidatorService>;

  beforeEach(() => {
    mockCampaignRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    mockValidatorService = {
      validateDates: jest.fn(),
    };

    createCampaignUseCase = new CreateCampaignUseCase(mockCampaignRepository, mockValidatorService);
  });

  it('deve criar uma campanha com sucesso', async () => {
    const dto: CreateCampaignDto = {
      name: 'Test Campaign',
      startDate: '2025-06-01T00:00:00.000Z', // Use string format
      endDate: '2025-06-30T23:59:59.000Z',
      categoryId: 1,
    };

    const createdCampaign = new Campaign(
      1,
      dto.name,
      new Date(dto.startDate),
      new Date(dto.endDate),
      new Category(1, 'Marketing')
    );

    mockCampaignRepository.create.mockResolvedValue(createdCampaign);

    const result = await createCampaignUseCase.execute(dto);

    expect(mockValidatorService.validateDates).toHaveBeenCalledWith(
      new Date(dto.startDate), 
      new Date(dto.endDate)
    );
    expect(mockCampaignRepository.create).toHaveBeenCalledWith(expect.any(Campaign));
    expect(result).toEqual(createdCampaign);
  });

  it('deve lançar BadRequestException se a data de início estiver no passado', async () => {
    const dto: CreateCampaignDto = {
      name: 'Invalid Campaign',
      startDate: '2022-01-01T00:00:00.000Z', // Data passada
      endDate: '2025-06-30T23:59:59.000Z',
      categoryId: 1,
    };

    mockValidatorService.validateDates.mockImplementation(() => {
      throw new BadRequestException('A data de início deve ser igual ou posterior à data atual.');
    });

    await expect(createCampaignUseCase.execute(dto)).rejects.toThrow(BadRequestException);
    expect(mockValidatorService.validateDates).toHaveBeenCalledWith(
      new Date(dto.startDate), 
      new Date(dto.endDate)
    );
  });

  it('deve lançar BadRequestException se a data de fim for anterior à data de início', async () => {
    const dto: CreateCampaignDto = {
      name: 'Invalid Campaign',
      startDate: '2025-06-30T23:59:59.000Z',
      endDate: '2025-06-01T00:00:00.000Z', // Inválida
      categoryId: 1,
    };

    mockValidatorService.validateDates.mockImplementation(() => {
      throw new BadRequestException('A data fim deve ser maior que a data de início.');
    });

    await expect(createCampaignUseCase.execute(dto)).rejects.toThrow(BadRequestException);
    expect(mockValidatorService.validateDates).toHaveBeenCalledWith(
      new Date(dto.startDate), 
      new Date(dto.endDate)
    );
  });
});
