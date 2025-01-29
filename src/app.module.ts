import { Module } from '@nestjs/common';
import { OpenAiModule } from './modules/open-ai.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [OpenAiModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
