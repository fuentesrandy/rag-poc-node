import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '@modules/core/core.module';
import { LlmModule } from '@modules/nlp/nlp.module';
import { DocumentsModule } from '@modules/documents/documents.module';
import { ChatModule } from '@modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
    LlmModule,
    DocumentsModule,
    ChatModule,
  ]
})
export class AppModule { }
