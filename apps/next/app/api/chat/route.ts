// Import necessary modules and SDKs
import { NextRequest } from 'next/server';
import { openai } from "@ai-sdk/openai";
import { createEdgeRuntimeAPI } from "@assistant-ui/react/edge";
// Example imports for other providers
// import { anthropic } from '@ai-sdk/anthropic';
import { vertex } from "@ai-sdk/google-vertex";
import { xai } from '@ai-sdk/xai';

// Helper function to create the appropriate model API based on provider and model
const createAPIWithModel = (provider: string, modelName: string) => {
  switch (provider) {
    case "openai":
      return createEdgeRuntimeAPI({
        model: openai(modelName),
      }).POST;
    // case "anthropic":
    //   return createEdgeRuntimeAPI({
    //     model: anthropic(modelName),
    //   }).POST;
    case "google":
      return createEdgeRuntimeAPI({
        model: vertex(modelName),
      }).POST;
    case "xai":
      return createEdgeRuntimeAPI({
        model: xai(modelName),
      }).POST;
    default:
      throw new Error("Unsupported provider: ${provider}");
  }
};

// Export the API handler
export const POST = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');
  const modelName = searchParams.get('modelName');

  if (!provider || !modelName) {
    return new Response(JSON.stringify({ error: 'Missing provider or modelName' }), { status: 400 });
  }

  try {
    const handler = createAPIWithModel(provider, modelName);
    return handler(request);
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
};

// import { openai } from "@ai-sdk/openai";
// import { createEdgeRuntimeAPI } from "@assistant-ui/react/edge";

// export const { POST } = createEdgeRuntimeAPI({
//   model: openai("gpt-4o-mini"),
// });