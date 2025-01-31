import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AzureChatOpenAI } from "@langchain/openai";
import { Injectable, Logger } from "@nestjs/common";
import { ChatLLMFactory } from './factories/chat-llm.factory';


@Injectable()
export class LlmService {
    private readonly contextWindow = 3;
    private readonly chatLLM: AzureChatOpenAI;
    private readonly logger = new Logger(LlmService.name);

    constructor() {
        this.chatLLM = ChatLLMFactory.getInstance();
    }

    async chat(systemMessage: string, chatHistory: string[], prompt: string) {
        const llm = this.chatLLM;
        const recentMessages = chatHistory.slice(-this.contextWindow);
        const messages = [new SystemMessage(systemMessage), ...recentMessages, new HumanMessage(prompt)];
        const result = await llm.invoke(messages);
        return result.content;
    }

}


