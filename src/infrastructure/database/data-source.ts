import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create DataSource instance
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  username: process.env.DB_USER || 'campaign',
  password: process.env.DB_PASSWORD || 'campaign',
  database: process.env.DB_NAME || 'campaigns_db',
  entities: [__dirname + '/typeorm/**/*.orm-entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: true,
  logging: false,
});

export default AppDataSource;
