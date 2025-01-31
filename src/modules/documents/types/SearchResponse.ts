

export type SearchResponse = {
    content: string;
    metadata: Record<string, unknown>;
    rank: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
}