import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { prompt: userPrompt } = (await req.json()) as {
    prompt?: string;
  };

  if (!userPrompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const systemPrompt = `You are a helpful assistant. Your goal is to provide AWS CLI command based on user prompt. Your output should provide only CLI command and that's it.`;

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
