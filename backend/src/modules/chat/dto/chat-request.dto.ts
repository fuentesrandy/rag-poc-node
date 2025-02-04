import { IsString, IsArray } from 'class-validator';

export class ChatRequestDto {
    @IsString()
    prompt: string;

    @IsArray()
    @IsString({ each: true })
    chatHistory: string[];
} 