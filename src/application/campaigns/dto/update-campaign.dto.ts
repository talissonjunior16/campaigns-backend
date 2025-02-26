import { IsOptional, IsDateString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCampaignDto {
  @ApiPropertyOptional({
    example: 'Promoção de Outono',
    description: 'Novo nome da campanha',
    minLength: 3,
    maxLength: 255,
  })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    example: '2025-09-01T00:00:00.000Z',
    description: 'Nova data de início no formato UTC (ISO 8601)',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    example: '2025-09-30T23:59:59.000Z',
    description: 'Nova data de término no formato UTC (ISO 8601)',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Novo ID da Categoria associada à campanha',
  })
  @IsOptional()
  @IsInt()
  categoryId?: number;
}