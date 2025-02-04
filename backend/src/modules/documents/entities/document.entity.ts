import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('documents')
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'vector', length: 1536 } as any)
    embedding: number[][] | string;

    @Column({ type: 'jsonb', nullable: true })
    metadata?: Record<string, any>;
}