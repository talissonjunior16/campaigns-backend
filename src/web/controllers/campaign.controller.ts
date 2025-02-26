import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateCampaignDto } from './../../application/campaigns/dto/create-campaign.dto';
import { CreateCampaignUseCase } from './../../application/campaigns/use-cases/create-campaign.use-case';
import { GetCampaignUseCase } from './../../application/campaigns/use-cases/get-campaign.use-case';
import { ListCampaignsUseCase } from './../../application/campaigns/use-cases/list-campaigns.use-case';
import { UpdateCampaignUseCase } from './../../application/campaigns/use-cases/update-campaign.use-case';
import { UpdateCampaignDto } from '../../application/campaigns/dto/update-campaign.dto';
import { DeleteCampaignUseCase } from '../../application/campaigns/use-cases/delete-campaign-use-case';
import { Campaign } from '../../domain/campaigns/campaign.entity';

@ApiTags('Campanhas')
@Controller('campaigns')
export class CampaignController {
  constructor(
    private readonly createCampaignUseCase: CreateCampaignUseCase,
    private readonly updateCampaignUseCase: UpdateCampaignUseCase,
    private readonly deleteCampaignUseCase: DeleteCampaignUseCase,
    private readonly getCampaignUseCase: GetCampaignUseCase,
    private readonly listCampaignsUseCase: ListCampaignsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova campanha' })
  @ApiResponse({ status: 201, description: 'Campanha criada com sucesso', type: Campaign })
  async create(@Body() dto: CreateCampaignDto) {
    return await this.createCampaignUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as campanhas' })
  @ApiResponse({ status: 200, description: 'Lista de campanhas retornada com sucesso', type: [Campaign] })
  async list() {
    return await this.listCampaignsUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma campanha pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da campanha' })
  @ApiResponse({ status: 200, description: 'Campanha encontrada', type: Campaign })
  @ApiResponse({ status: 404, description: 'Campanha não encontrada' })
  async get(@Param('id') id: number) {
    return await this.getCampaignUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma campanha existente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da campanha a ser atualizada' })
  @ApiResponse({ status: 200, description: 'Campanha atualizada com sucesso', type: Campaign })
  @ApiResponse({ status: 404, description: 'Campanha não encontrada' })
  async update(@Param('id') id: number, @Body() dto: UpdateCampaignDto) {
    return await this.updateCampaignUseCase.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta uma campanha (Soft Delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da campanha a ser deletada' })
  @ApiResponse({ status: 200, description: 'Campanha deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Campanha não encontrada' })
  async delete(@Param('id') id: number) {
    return await this.deleteCampaignUseCase.execute(id);
  }
}