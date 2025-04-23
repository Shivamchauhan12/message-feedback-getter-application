// app/api/ai/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({
        message: 'Invalid format: messages must be an array.',
        success: false,
      }), { status: 400 });
    }

    const result = await streamText({
      model: openai('gpt-4o'),
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error generating text:', error);
    return new Response(
      JSON.stringify({ message: 'Error generating message', success: false }),
      { status: 500 }
    );
  }
}
