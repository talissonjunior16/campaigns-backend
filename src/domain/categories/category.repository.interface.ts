import { Category } from './category.entity';

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  // No create/update/delete methods since we won't manage categories via API
  // we will instead create them when database init
}
