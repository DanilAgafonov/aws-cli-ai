import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { prompt: rawUserPrompt } = (await req.json()) as {
    prompt?: string;
  };

  if (!rawUserPrompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const systemPrompt = `You are a helpful assistant. Your goal is to provide AWS CLI command based on user prompt. Your output should provide only CLI command and that's it. Never output anything except CLI command. Skip any explanations or additional information. Parametrize everything you can. Use placeholders for any values that you don't know. Example of placeholder: <example_of_placeholder>. If you need to provide multiple commands, combine them with && and do not provide explanations.`;
  const userPrompt = `
  ${rawUserPrompt}
  
  AWS CLI command:
  `;

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    temperature: 0,
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
