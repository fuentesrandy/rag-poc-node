import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { EmbeddingService } from './embedding.service';

@Module({
    imports: [],
    controllers: [

    ],
    providers: [LlmService, EmbeddingService],
    exports: [LlmService, EmbeddingService]
})
export class LlmModule { }

