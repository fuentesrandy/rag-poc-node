export interface DocumentChunk {
    content: string;
    embedding: number[];
    metadata?: {
        pageNumber?: number;
        fileName: string;
        createdAt: Date;
    };
} 