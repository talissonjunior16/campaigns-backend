import { IsNotEmpty, IsDateString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({ 
    example: 'Promoção de Verão', 
    description: 'Nome da campanha', 
    minLength: 3, 
    maxLength: 255 
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: '2025-06-27T00:00:00.000Z', 
    description: 'Data de Início no formato UTC (ISO 8601)', 
    format: 'date-time' 
  })

  @IsDateString()
  startDate: string;

  @ApiProperty({ 
    example: '2025-06-30T23:59:59.000Z', 
    description: 'Data de Término no formato UTC (ISO 8601)', 
    format: 'date-time' 
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({ 
    example: 1, 
    description: 'ID da Categoria associada à campanha' 
  })
  @IsNotEmpty()
  @IsInt()
  categoryId: number;
}