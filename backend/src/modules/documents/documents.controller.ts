import { Controller, Post, UploadedFile, UseInterceptors, HttpCode } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';


@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post('add-document')
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(201)
    async addDocument(@UploadedFile() file: Express.Multer.File) {
        await this.documentsService.addDocument(file);
        return {
            message: 'Document added successfully'
        };
    }
}