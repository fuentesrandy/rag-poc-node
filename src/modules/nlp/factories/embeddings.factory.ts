import { AzureOpenAIEmbeddings } from "@langchain/openai";

export class EmbeddingsFactory {
    private static instance: AzureOpenAIEmbeddings | null = null;

    public static getInstance(): AzureOpenAIEmbeddings {
        if (!EmbeddingsFactory.instance) {
            EmbeddingsFactory.instance = new AzureOpenAIEmbeddings({
                azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
                azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
                azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
                azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
                maxRetries: 2,
            });
        }
        return EmbeddingsFactory.instance;
    }

    // Prevent instantiation
    private constructor() { }
} 