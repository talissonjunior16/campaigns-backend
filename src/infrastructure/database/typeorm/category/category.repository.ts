import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryOrmEntity } from './category.orm-entity';
import { ICategoryRepository } from '../../../../domain/categories/category.repository.interface';
import { Category } from '../../../../domain/categories/category.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly repo: Repository<CategoryOrmEntity>,
  ) {}

  async findAll(): Promise<Category[]> {
    const ormEntities = await this.repo.find();
    return ormEntities.map((entity) =>
      plainToInstance(Category, entity),
    );
  }
}
