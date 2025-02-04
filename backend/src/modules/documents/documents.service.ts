import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { DocumentChunk } from './types/DocumentChunk';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { BlobStorageService } from '../core/blob-storage/blob-storage.service';
import { SearchResponse } from './types/SearchResponse';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { EmbeddingService } from '../nlp/embedding.service';


type Metadata = Record<string, unknown>;



@Injectable()
export class DocumentsService {
    private readonly logger = new Logger(DocumentsService.name);
    constructor(
        private readonly embeddingService: EmbeddingService,
        private readonly blobStorageService: BlobStorageService,
        @InjectRepository(Document)
        private readonly documentRepository: Repository<Document>
    ) { }

    async addDocument(file: Express.Multer.File) {

        const blobUploaded = await this.blobStorageService.uploadFile(file.originalname, file.buffer);
        if (!blobUploaded) {
            throw new Error('Failed to upload file to blob storage');
        }


        const fileContent = await this.getFileContentAsString(file);
        if (!fileContent) {
            throw new Error('File content is empty');
        }
        const chunkedDocs = await this.getSplitStrings(fileContent);
        const embeddings = await this.embeddingService.getEmbeddings(chunkedDocs);
        const documentChunks: DocumentChunk[] = chunkedDocs.map((content, index) => ({
            content,
            embedding: embeddings[index],
            metadata: {
                fileName: file.originalname,
                createdAt: new Date()
            }
        }));

        const savePromises = documentChunks.map(chunk =>
            this.documentRepository.save(
                this.documentRepository.create({
                    content: chunk.content,
                    embedding: `[${chunk.embedding.join(",")}]`,
                    metadata: {
                        ...chunk.metadata
                    }
                })
            )
        );

        const results = await Promise.allSettled(savePromises);
        const savedCount = results.filter(result => result.status === 'fulfilled').length;
        this.logger.log(`Successfully saved ${savedCount}/${documentChunks.length} chunks`);

        const failures = results.filter(result => result.status === 'rejected') as PromiseRejectedResult[];
        if (failures.length > 0) {
            failures.forEach(failure => {
                this.logger.error('Failed to save document chunk:', failure.reason);
            });
            throw new Error(`Failed to save ${failures.length} document chunks`);
        }
    }

    private async getFileContentAsString(file: Express.Multer.File) {
        const fileType = file.mimetype;
        const tempDir = path.join(__dirname, '..', 'temp');
        let filePath: string | undefined;
        if (fileType === 'application/pdf') {
            try {
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }
                filePath = path.join(tempDir, file.originalname);
                fs.writeFileSync(filePath, file.buffer);

                const loader = new PDFLoader(filePath);
                const docs = await loader.load();
                const text = docs.map(doc => doc.pageContent).join("\n");
                return text;
            } catch (error) {
                this.logger.error('Error processing PDF file', error);
                throw new Error('Error processing PDF file');
            } finally {
                if (filePath && fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                if (fs.existsSync(tempDir)) {
                    fs.rmdirSync(tempDir);
                }
            }
        } else {
            throw new Error('Unsupported file type');
        }
    }

    async searchSimilarDocuments(embedding: number[], filter: Metadata, limit = 5)
        : Promise<SearchResponse[]> {
        const embeddingString = `[${embedding.join(",")}]`;
        const _filter = filter ?? "{}";

        const queryString = `
          WITH ranked_docs AS (
            SELECT 
              id,
              content,
              metadata,
              embedding <=> $1 as rank
            FROM documents
            WHERE metadata @> $2
            ORDER BY rank ASC
            LIMIT $3
          )
          SELECT 
            id,
            content,
            metadata,
            rank
          FROM ranked_docs;`;

        const results = await this.documentRepository.query(
            queryString,
            [embeddingString, _filter, limit]
        );

        return results;
    }

    private async getSplitStrings(str: string): Promise<string[]> {
        try {
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1500,
                chunkOverlap: 250,
            });
            const chunkedDocs = await textSplitter.splitText(str);
            return chunkedDocs;
        } catch (e) {
            this.logger.error('Error splitting text', e);
            throw e;
        }
    }
} 