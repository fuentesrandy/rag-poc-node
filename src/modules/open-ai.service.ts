import { HumanMessage } from "@langchain/core/messages";
import { AzureChatOpenAI, ChatOpenAI, OpenAI } from "@langchain/openai";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OpenAiService {
    private readonly chatLLM: AzureChatOpenAI;

    constructor() {
        this.chatLLM = new AzureChatOpenAI({
            model: "gpt-4o",
            azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
            azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
            azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
            azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
            temperature: 0,
            maxTokens: undefined,
            timeout: undefined,
            maxRetries: 2,
        });
    }

    async prompt(prompt: string) {
        const llm = this.chatLLM;
        const result = await llm.invoke([new HumanMessage(prompt)]);
        return result.content;
    }
}