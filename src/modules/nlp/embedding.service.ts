import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AzureOpenAIEmbeddings } from '@langchain/openai';
import { EmbeddingsFactory } from './factories/embeddings.factory';

@Injectable()
export class EmbeddingService {
    private embeddings: AzureOpenAIEmbeddings;

    constructor(private configService: ConfigService) {
        this.embeddings = EmbeddingsFactory.getInstance();
    }

    async getEmbedding(str: string): Promise<number[]> {
        const embedding = await this.embeddings.embedQuery(str);
        return embedding;
    }

    async getEmbeddings(docs: string[]): Promise<number[][]> {
        const embeddings = await this.embeddings.embedDocuments(docs);
        return embeddings;
    }
}
