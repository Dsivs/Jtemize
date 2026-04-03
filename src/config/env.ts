import "dotenv/config";

const requiredKeys = ["OPENAI_API_KEY", "DISCORD_BOT_TOKEN"] as const;

type RequiredKey = (typeof requiredKeys)[number];

function readRequiredEnv(key: RequiredKey): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  openAiApiKey: readRequiredEnv("OPENAI_API_KEY"),
  discordBotToken: readRequiredEnv("DISCORD_BOT_TOKEN"),
  discordClientId: process.env.DISCORD_CLIENT_ID ?? "",
  discordGuildId: process.env.DISCORD_GUILD_ID ?? "",
  openAiModel: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
};
