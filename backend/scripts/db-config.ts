import { config } from 'dotenv';
import { ColumnType, DataSource, DataSourceOptions } from 'typeorm';

config();

export const typeOrmConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '54369'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/src/modules/core/database/migrations/*.js'],
};

const AppDataSource = new DataSource(typeOrmConfig);
// hack to support vector column type
AppDataSource.driver.supportedDataTypes.push('vector' as ColumnType);
AppDataSource.driver.withLengthColumnTypes.push('vector' as ColumnType);

export default AppDataSource;