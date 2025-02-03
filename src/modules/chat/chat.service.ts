import { Injectable } from '@nestjs/common';
import { LlmService } from '@modules/nlp/llm.service';
import { DocumentsService } from '@modules/documents/documents.service';
import { EmbeddingService } from '@modules/nlp/embedding.service';

@Injectable()
export class ChatService {
    constructor(
        private readonly llmService: LlmService,
        private readonly documentsService: DocumentsService,
        private readonly embeddingService: EmbeddingService
    ) { }

    async chat(chatHistory: string[], prompt: string) {
        const promptEmbedding = await this.embeddingService.getEmbedding(prompt);
        const similarDocuments = await this.documentsService.searchSimilarDocuments(promptEmbedding, {}, 10);
        const docContext = similarDocuments.map(doc => doc.content).join('\n\n');
        const systemMessage = `
            You are a helpful assistant that can answer questions about the user's documents.
            START CONTEXT
            ${docContext}
            END CONTEXT
        `;
        return this.llmService.chat(systemMessage, chatHistory, prompt);
    }
} 