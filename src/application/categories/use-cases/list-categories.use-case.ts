import { ICategoryRepository } from '../../../domain/categories/category.repository.interface';
import { Category } from '../../../domain/categories/category.entity';

export class ListCategoriesUseCase {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(): Promise<Category[]> {
    return await this.categoryRepo.findAll();
  }
}
