import { Injectable, Logger } from '@nestjs/common';
import { BlobServiceClient, ContainerClient, BlobUploadCommonResponse } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';

interface FileMetadata {
    [key: string]: string;
}

@Injectable()
export class BlobStorageService {
    private containerClient: ContainerClient;
    private readonly logger = new Logger(BlobStorageService.name);

    constructor(private configService: ConfigService) {
        const connectionString = this.configService.get<string>('AZURE_STORAGE_CONNECTION_STRING');
        const containerName = this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME');

        if (!connectionString || !containerName) {
            throw new Error('Azure Storage configuration is missing');
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        this.containerClient = blobServiceClient.getContainerClient(containerName);
    }

    /**
     * Upload a file with metadata
     * @param fileName - Name of the file
     * @param content - File content (Buffer, string, or stream)
     * @param metadata - Optional metadata key-value pairs
     */
    async uploadFile(fileName: string, content: Buffer | string | ReadableStream, metadata?: FileMetadata)
        : Promise<boolean> {
        try {
            const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);

            const contentType = this.getContentType(fileName);

            const options = {
                metadata,
                blobHTTPHeaders: {
                    blobContentType: contentType
                }
            };

            await blockBlobClient.upload(content, Buffer.byteLength(content as Buffer), options);
            this.logger.log(`File ${fileName} uploaded successfully`);
            return true;
        } catch (error) {
            this.logger.error(`Error uploading file ${fileName}:`, error);
            return false;
        }


    }

    private getContentType(fileName: string): string {
        const extension = fileName.split('.').pop()?.toLowerCase();
        const mimeTypes: { [key: string]: string } = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'txt': 'text/plain',
            'json': 'application/json',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png'
            // Add more mime types as needed
        };

        return mimeTypes[extension || ''] || 'application/octet-stream';
    }

    /**
     * Retrieve a file by its name
     * @param fileName - Name of the file to retrieve
     */
    async getFileByName(fileName: string): Promise<Buffer> {
        try {
            const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
            const downloadResponse = await blockBlobClient.download(0);

            return await this.streamToBuffer(downloadResponse.readableStreamBody!);
        } catch (error) {
            this.logger.error(`Error retrieving file ${fileName}:`, error);
            throw error;
        }
    }

    /**
     * Find files by metadata
     * @param metadata - Metadata key-value pairs to search for
     * @returns Array of matching file names
     */
    async findFilesByMetadata(metadata: FileMetadata): Promise<string[]> {
        const matchingFiles: string[] = [];

        try {
            for await (const blob of this.containerClient.listBlobsFlat({ includeMetadata: true })) {
                if (this.matchesMetadata(blob.metadata || {}, metadata)) {
                    matchingFiles.push(blob.name);
                }
            }
            return matchingFiles;
        } catch (error) {
            this.logger.error('Error searching files by metadata:', error);
            throw error;
        }
    }

    /**
     * Get file content by metadata (returns the first matching file)
     * @param metadata - Metadata key-value pairs to search for
     */
    async getFileByMetadata(metadata: FileMetadata): Promise<Buffer | null> {
        try {
            const matchingFiles = await this.findFilesByMetadata(metadata);

            if (matchingFiles.length === 0) {
                return null;
            }

            return await this.getFileByName(matchingFiles[0]);
        } catch (error) {
            this.logger.error('Error retrieving file by metadata:', error);
            throw error;
        }
    }

    private matchesMetadata(blobMetadata: FileMetadata, searchMetadata: FileMetadata): boolean {
        return Object.entries(searchMetadata).every(([key, value]) =>
            blobMetadata[key] === value
        );
    }

    private async streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            readableStream.on('data', (data) => {
                chunks.push(data instanceof Buffer ? data : Buffer.from(data));
            });
            readableStream.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
            readableStream.on('error', reject);
        });
    }
} 