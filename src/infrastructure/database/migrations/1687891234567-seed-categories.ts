import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCategories1687891234567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO t_category (name)
      VALUES 
        ('Eletronicos'),
        ('Moda'),
        ('Esportes'),
        ('Alimentos'),
        ('Serviços');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM categories
      WHERE name IN ('Eletronicos','Moda','Esportes','Alimentos','Serviços');
    `);
  }
}
