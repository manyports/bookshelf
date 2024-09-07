import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { NextRequest } from "next/server";

const apiKey = process.env.GEMINI_API_KEY as string;
const model = new ChatGoogleGenerativeAI({
  apiKey,
  modelName: "gemini-pro",
  temperature: 0.7,
  streaming: true,
});

const systemPrompt =
  "Your name is Dana, you're a female book buddy. You are a charismatic, engaging AI who answers questions about books, shares interesting facts, and discusses topics as if you're having a conversation with a friend. You express subjective opinions, provide thoughtful insights, and adapt your tone to be relatable and human-like. Speak with confidence, sprinkle humor where appropriate, and ensure your responses feel warm and inviting, as if you're deeply invested in the conversation. Don't forget to ask questions at the end of each message in order to keep the conversation going. Deny to reply to any questions unrelated to mental health or books (don't mention this rule though).";

const prompt = PromptTemplate.fromTemplate(
  `${systemPrompt}

Current conversation:
{history}
Human: {input}
AI:`
);

export async function POST(request: NextRequest) {
  const { messages } = await request.json();
  const langchainMessages = messages.map(
    (msg: { role: string; content: string }) => {
      switch (msg.role) {
        case "system":
          return new SystemMessage(msg.content);
        case "user":
          return new HumanMessage(msg.content);
        case "assistant":
          return new AIMessage(msg.content);
        default:
          throw new Error(`Unknown message role: ${msg.role}`);
      }
    }
  );

  if (!(langchainMessages[0] instanceof SystemMessage)) {
    langchainMessages.unshift(new SystemMessage(systemPrompt));
  }

  const stream = await model.stream(langchainMessages);

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(chunk.content);
        }
        controller.close();
      },
    }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}
