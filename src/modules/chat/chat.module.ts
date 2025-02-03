import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { LlmModule } from '@modules/nlp/nlp.module';
import { DocumentsModule } from '@modules/documents/documents.module';

@Module({
  imports: [LlmModule, DocumentsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule { } 