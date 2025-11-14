import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST, 
  port: 5432,
  username: 'postgres', 
  password: 'Liongineer1!', 
  database: 'reviewdb',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Important: false since DB exists
  logging: true, // Helpful for debugging
  extra: {
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
};