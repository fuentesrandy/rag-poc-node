import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { LlmModule } from '../nlp/nlp.module';
import { ChatService } from './chat.service';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [LlmModule, DocumentsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule { } 