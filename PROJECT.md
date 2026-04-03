# Jtemize

Jtemize is a TypeScript project that uses Discord as the frontend, Mastra as the agent framework, and an OpenAI model to chat with users and extract invoice data into structured JSON.

## What It Does

- Chat with users through Discord using `!chat`
- Extract invoice JSON from pasted text using `!invoice`
- Extract invoice JSON from attached images and PDFs using `!invoice`
- Validate extracted invoice output with Zod

## Stack

- TypeScript for the full application code
- Discord.js for the bot interface
- Mastra for agent orchestration
- OpenAI for chat and invoice extraction
- Zod for schema validation

## Project Structure

- [src/index.ts](/Users/huangweide/Documents/Playground/src/index.ts): app entrypoint
- [src/discord/create-discord-client.ts](/Users/huangweide/Documents/Playground/src/discord/create-discord-client.ts): Discord message handling
- [src/mastra/agents/jtemize-agent.ts](/Users/huangweide/Documents/Playground/src/mastra/agents/jtemize-agent.ts): agent instructions and model setup
- [src/services/chat-with-jtemize.ts](/Users/huangweide/Documents/Playground/src/services/chat-with-jtemize.ts): chat service
- [src/services/extract-invoice-json.ts](/Users/huangweide/Documents/Playground/src/services/extract-invoice-json.ts): invoice extraction service
- [src/domain/invoice-schema.ts](/Users/huangweide/Documents/Playground/src/domain/invoice-schema.ts): Zod invoice schema

## Commands

```bash
npm run dev
npm run typecheck
```

## Environment Variables

Create a `.env` file with:

```env
OPENAI_API_KEY=your_openai_api_key
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_application_id
DISCORD_GUILD_ID=optional_test_server_id
OPENAI_MODEL=gpt-4.1-mini
```

## Discord Usage

- `!chat What can you do?`
- `!invoice` plus pasted invoice text
- `!invoice` plus an attached invoice image or PDF

## Current Scope

This version is designed as a learning project for me leanring TypeScript and agent-based app structure.
