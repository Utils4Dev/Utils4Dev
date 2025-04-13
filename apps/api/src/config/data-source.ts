import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { join } from 'path';
import * as tsConfigPaths from 'tsconfig-paths';
import { resolve } from 'path';

// Registrar os paths do tsconfig.json para funcionar em runtime
const baseUrl = resolve(__dirname, '..');
tsConfigPaths.register({
  baseUrl,
  paths: { 'src/*': ['*'] },
});

const {
  NODE_ENV,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT || '5432'),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
  synchronize: NODE_ENV === 'local',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
