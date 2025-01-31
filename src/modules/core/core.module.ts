import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ColumnType, DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlobStorageModule } from './blob-storage/blob-storage.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT') || '54369'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false// configService.get('NODE_ENV') !== 'production',
      }),
      dataSourceFactory: async (options) => {
        //https://github.com/typeorm/typeorm/issues/10056#issuecomment-2322834561
        const dataSource = new DataSource(options as DataSourceOptions);
        dataSource.driver.withLengthColumnTypes.push('vector' as ColumnType);
        dataSource.driver.supportedDataTypes.push('vector' as ColumnType);
        await dataSource.initialize()
        return dataSource
      },
      inject: [ConfigService],
    }),
    BlobStorageModule,
  ],
  providers: [

  ],
  exports: [
    TypeOrmModule,
    BlobStorageModule
  ],
})
export class CoreModule { } 