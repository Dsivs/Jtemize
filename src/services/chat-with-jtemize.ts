import { mastra } from "../mastra/index.js";

export async function chatWithJtemize(userMessage: string): Promise<string> {
  const agent = mastra.getAgent("jtemizeAgent");
  const result = await agent.generate([
    {
      role: "user",
      content: userMessage,
    },
  ]);

  return result.text.trim();
}
