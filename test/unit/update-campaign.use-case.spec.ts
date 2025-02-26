import { UpdateCampaignUseCase } from '../../src/application/campaigns/use-cases/update-campaign.use-case';
import { ICampaignRepository } from '../../src/domain/campaigns/campaign.repository.interface';
import { UpdateCampaignDto } from '../../src/application/campaigns/dto/update-campaign.dto';
import { Campaign } from '../../src/domain/campaigns/campaign.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CampaignValidatorService } from '../../src/application/campaigns/services/campaign-validator.service';
import { Category } from '../../src/domain/categories/category.entity';

describe('Caso de Uso: Atualizar Campanha', () => {
  let updateCampaignUseCase: UpdateCampaignUseCase;
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

    updateCampaignUseCase = new UpdateCampaignUseCase(mockCampaignRepository, mockValidatorService);
  });

  it('deve atualizar uma campanha com sucesso', async () => {
    const existingCampaign = new Campaign(
      1,
      'Campanha Original',
      new Date('2025-06-26T20:00:00.000Z'),
      new Date('2025-06-30T23:59:59.000Z'),
      new Category(1, 'Marketing')
    );
  
    const dto: UpdateCampaignDto = {
      name: 'Campanha Atualizada',
      startDate: '2025-06-26T20:00:00.000Z',
      endDate: '2025-06-30T23:59:59.000Z',
      categoryId: 2,
    };
  
    const updatedCampaign = new Campaign(
      1,
      dto.name!,
      new Date(dto.startDate),
      new Date(dto.endDate),
      new Category(2, 'Vendas')
    );
  
    mockCampaignRepository.findById.mockResolvedValue(existingCampaign);
    mockCampaignRepository.update.mockResolvedValue(updatedCampaign);
  
    const result = await updateCampaignUseCase.execute(1, dto);
  
    expect(mockValidatorService.validateDates).toHaveBeenCalledWith(
      new Date(dto.startDate), 
      new Date(dto.endDate), 
      existingCampaign.createdAt
    );
  
    expect(mockCampaignRepository.update).toHaveBeenCalledWith(expect.any(Campaign));
    expect(result).toEqual(updatedCampaign);
  });
  

  it('deve lançar NotFoundException se a campanha não existir', async () => {
    const dto: UpdateCampaignDto = {
      name: 'Campanha Inexistente',
      startDate:'2025-07-01T00:00:00.000Z',
      endDate:'2025-07-31T23:59:59.000Z',
      categoryId: 1,
    };

    mockCampaignRepository.findById.mockResolvedValue(null);

    await expect(updateCampaignUseCase.execute(999, dto)).rejects.toThrow(NotFoundException);
    expect(mockCampaignRepository.findById).toHaveBeenCalledWith(999);
  });

  it('deve lançar BadRequestException se a data de início for no passado', async () => {
    const existingCampaign = new Campaign(
      1,
      'Campanha Original',
      new Date('2025-06-01T00:00:00.000Z'),
      new Date('2025-06-30T23:59:59.000Z'),
      new Category(1, 'Marketing')
    );
  
    const dto: UpdateCampaignDto = {
      startDate: '2022-01-01T00:00:00.000Z', // Data inválida no passado
      endDate: '2025-06-30T23:59:59.000Z',
    };
  
    mockCampaignRepository.findById.mockResolvedValue(existingCampaign);
    mockValidatorService.validateDates.mockImplementation(() => {
      throw new BadRequestException('A data de início deve ser igual ou posterior à data atual.');
    });
  
    await expect(updateCampaignUseCase.execute(1, dto)).rejects.toThrow(BadRequestException);
  
    // Ensure `validateDates` is called with `Date` objects instead of strings
    expect(mockValidatorService.validateDates).toHaveBeenCalledWith(
      new Date(dto.startDate), 
      new Date(dto.endDate),
      existingCampaign.createdAt
    );
  });

  it('deve lançar BadRequestException se a data de fim for antes da data de início', async () => {
    const existingCampaign = new Campaign(
      1,
      'Campanha Original',
      new Date('2025-06-01T00:00:00.000Z'),
      new Date('2025-06-30T23:59:59.000Z'),
      new Category(1, 'Marketing')
    );

    const dto: UpdateCampaignDto = {
      startDate: '2025-07-30T23:59:59.000Z',
      endDate: '2025-07-01T00:00:00.000Z', // Data inválida
    };

    mockCampaignRepository.findById.mockResolvedValue(existingCampaign);
    mockValidatorService.validateDates.mockImplementation(() => {
      throw new BadRequestException('A data fim deve ser maior que a data de início.');
    });

    await expect(updateCampaignUseCase.execute(1, dto)).rejects.toThrow(BadRequestException);
    expect(mockValidatorService.validateDates).toHaveBeenCalledWith(
      new Date(dto.startDate), 
      new Date(dto.endDate),
      existingCampaign.createdAt
    );
  });

  it('deve manter a categoria existente se nenhuma nova categoria for fornecida', async () => {
    const existingCampaign = new Campaign(
      1,
      'Campanha Original',
      new Date('2025-06-01T00:00:00.000Z'),
      new Date('2025-06-30T23:59:59.000Z'),
      new Category(1, 'Marketing')
    );

    const dto: UpdateCampaignDto = {
      name: 'Campanha Atualizada',
      startDate:'2025-07-01T00:00:00.000Z',
      endDate:'2025-07-31T23:59:59.000Z',
    };

    const updatedCampaign = new Campaign(
      1,
      dto.name!,
      new Date(dto.startDate),
      new Date(dto.endDate),
      existingCampaign.category
    );

    mockCampaignRepository.findById.mockResolvedValue(existingCampaign);
    mockCampaignRepository.update.mockResolvedValue(updatedCampaign);

    const result = await updateCampaignUseCase.execute(1, dto);

    expect(result.category).toEqual(existingCampaign.category);
  });

  it('deve atualizar a categoria se um novo categoryId for fornecido', async () => {
    const existingCampaign = new Campaign(
      1,
      'Campanha Original',
      new Date('2025-06-01T00:00:00.000Z'),
      new Date('2025-06-30T23:59:59.000Z'),
      new Category(1, 'Marketing')
    );

    const dto: UpdateCampaignDto = {
      name: 'Campanha Atualizada',
      startDate: '2025-07-01T00:00:00.000Z',
      endDate: '2025-07-31T23:59:59.000Z',
      categoryId: 2,
    };

    const updatedCampaign = new Campaign(
      1,
      dto.name!,
      new Date(dto.startDate),
      new Date(dto.endDate),
      new Category(2, '')
    );

    mockCampaignRepository.findById.mockResolvedValue(existingCampaign);
    mockCampaignRepository.update.mockResolvedValue(updatedCampaign);

    const result = await updateCampaignUseCase.execute(1, dto);

    expect(result.category.id).toEqual(dto.categoryId);
    expect(result.category.name).toBe(''); // Nome não foi atualizado diretamente
  });
});
