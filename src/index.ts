import { env } from "./config/env.js";
import { createDiscordClient } from "./discord/create-discord-client.js";

async function main(): Promise<void> {
  const client = createDiscordClient();
  await client.login(env.discordBotToken);
}

main().catch((error) => {
  console.error("Failed to start Jtemize:", error);
  process.exitCode = 1;
});
