import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ListCategoriesUseCase } from '../../application/categories/use-cases/list-categories.use-case';
import { Category } from '../../domain/categories/category.entity';
import { CategoryRepository } from '../../infrastructure/database/typeorm/category/category.repository';

@ApiTags('Categorias')
@Controller('categories')
export class CategoryController {
  private listCategoriesUseCase: ListCategoriesUseCase;

  constructor(private readonly categoryRepo: CategoryRepository) {
    this.listCategoriesUseCase = new ListCategoriesUseCase(this.categoryRepo);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as categorias disponíveis' })
  @ApiResponse({ status: 200, description: 'Lista de categorias retornada com sucesso', type: [Category] })
  async list() {
    return this.listCategoriesUseCase.execute();
  }
}
