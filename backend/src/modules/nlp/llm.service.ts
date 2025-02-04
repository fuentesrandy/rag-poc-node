import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AzureChatOpenAI } from "@langchain/openai";
import { Injectable, Logger } from "@nestjs/common";
import { ChatLLMFactory } from './factories/chat-llm.factory';
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { Observable } from "rxjs";

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

    async chatStream(systemMessage: string, chatHistory: string[], prompt: string): Promise<Observable<string>> {
        const llm = this.chatLLM;
        const recentMessages = (chatHistory ?? []).slice(-this.contextWindow);
        const messages = [new SystemMessage(systemMessage), ...recentMessages, new HumanMessage(prompt)];
        return new Observable<string>((observer) => {
            llm.invoke(messages, {
                callbacks: [
                    {
                        handleLLMNewToken: (token) => {
                            observer.next(token);
                        },
                        handleLLMEnd: () => {
                            observer.complete();
                        },
                        handleLLMError: (err) => {
                            observer.error(err);
                        },
                    },
                ],
            })
                .catch((err) => observer.error(err));
        });
    }
}


