
import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { OpenAiService } from "./open-ai.service";

@Controller('open-ai')
export class OpenAiController {
    constructor(private readonly openAiService: OpenAiService) { }

    @Post('prompt')
    prompt(@Body() body: { prompt: string }) {
        return this.openAiService.prompt(body.prompt);
    }
}