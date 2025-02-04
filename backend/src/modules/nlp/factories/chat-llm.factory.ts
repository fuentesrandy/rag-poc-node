import { AzureChatOpenAI } from "@langchain/openai";

export class ChatLLMFactory {
    private static instance: AzureChatOpenAI;

    public static getInstance(): AzureChatOpenAI {
        if (!ChatLLMFactory.instance) {
            ChatLLMFactory.instance = new AzureChatOpenAI({
                streaming: true, 
                model: process.env.AZURE_OPENAI_MODEL,
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
        return ChatLLMFactory.instance;
    }
    private constructor() { }
} 