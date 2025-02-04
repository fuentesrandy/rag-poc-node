import { Controller, Post, Body, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('')
    async chat(@Body() body: ChatRequestDto) {
        return this.chatService.chat(body.chatHistory, body.prompt);
    }

    @Post('stream')
    async chatStream(@Body() body: ChatRequestDto, @Res() res: Response) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const stream$ = await this.chatService.chatStream(body.chatHistory, body.prompt);
        stream$.subscribe({
            next: (chunk) => res.write(chunk),
            complete: () => res.end(),
            error: (err) => {
                res.write(`Error: ${err.message}`);
                res.end();
            },
        });
    }
}       