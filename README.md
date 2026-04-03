# Jtemize

Jtemize is a TypeScript Discord bot that uses Mastra and an OpenAI model to chat with users and extract invoice data into structured JSON from text, images, and PDFs.

## What It Does

- Chat with users through Discord using `!chat`
- Extract invoice JSON from pasted text using `!invoice`
- Extract invoice JSON from attached images and PDFs using `!invoice`
- Validate extracted invoice output with Zod

## Stack

- TypeScript
- Discord.js
- Mastra
- OpenAI
- Zod

## Project Structure

- [src/index.ts](/Users/huangweide/Documents/Playground/src/index.ts): app entrypoint
- [src/discord/create-discord-client.ts](/Users/huangweide/Documents/Playground/src/discord/create-discord-client.ts): Discord message handling
- [src/mastra/agents/jtemize-agent.ts](/Users/huangweide/Documents/Playground/src/mastra/agents/jtemize-agent.ts): agent instructions and model setup
- [src/services/chat-with-jtemize.ts](/Users/huangweide/Documents/Playground/src/services/chat-with-jtemize.ts): chat service
- [src/services/extract-invoice-json.ts](/Users/huangweide/Documents/Playground/src/services/extract-invoice-json.ts): invoice extraction service
- [src/domain/invoice-schema.ts](/Users/huangweide/Documents/Playground/src/domain/invoice-schema.ts): Zod invoice schema

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_application_id
DISCORD_GUILD_ID=optional_test_server_id
OPENAI_MODEL=gpt-4.1-mini
```

3. In the Discord Developer Portal:

- Create or open your application
- Add a bot under the `Bot` section
- Copy the bot token into `DISCORD_BOT_TOKEN`
- Use the Application ID as `DISCORD_CLIENT_ID`
- Enable `Message Content Intent`
- Invite the bot to your Discord server

## How To Run

Start the bot in development mode:

```bash
npm run dev
```

If startup succeeds, you should see a log like:

```txt
Discord bot ready as ...
```

You can also run a type check:

```bash
npm run typecheck
```

## Discord Usage

- `!chat What can you do?`
- `!invoice` plus pasted invoice text
- `!invoice` plus an attached invoice image
- `!invoice` plus an attached invoice PDF

## Notes

- This project is designed as a learning project for TypeScript and agent-based application structure.
- The current bot uses Discord message commands, not slash commands.
- The local `.env` file should not be committed to Git.
