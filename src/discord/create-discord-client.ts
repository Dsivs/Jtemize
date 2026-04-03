import {
  Attachment,
  Client,
  GatewayIntentBits,
  Partials,
  type Message,
} from "discord.js";

import { chatWithJtemize } from "../services/chat-with-jtemize.js";
import { extractInvoiceJson } from "../services/extract-invoice-json.js";

const HELP_TEXT = [
  "Send `!invoice` followed by pasted invoice text, or attach an invoice image/PDF to extract JSON.",
  "Send `!chat` followed by a message to talk with Jtemize.",
  "Examples:",
  "`!invoice Invoice #123 ...`",
  "`!invoice` with an attached invoice PDF or image",
  "`!chat What fields do you usually extract from invoices?`",
].join("\n");

function isSupportedInvoiceAttachment(attachment: Attachment): boolean {
  const mimeType = attachment.contentType?.toLowerCase() ?? "";

  return mimeType.startsWith("image/") || mimeType === "application/pdf";
}

async function downloadAttachment(attachment: Attachment): Promise<Buffer> {
  const response = await fetch(attachment.url);

  if (!response.ok) {
    throw new Error(
      `Failed to download attachment: ${response.status} ${response.statusText}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function stripCommandPrefix(content: string, command: "invoice" | "chat"): string {
  return content.replace(new RegExp(`^!${command}\\b`, "i"), "").trim();
}

function getCommand(message: Message): "invoice" | "chat" | null {
  const content = message.content.trim().toLowerCase();

  if (content.startsWith("!invoice")) {
    return "invoice";
  }

  if (content.startsWith("!chat")) {
    return "chat";
  }

  return null;
}

async function handleInvoiceMessage(message: Message): Promise<void> {
  const invoiceText = stripCommandPrefix(message.content, "invoice");
  const attachment = message.attachments.find(isSupportedInvoiceAttachment) ?? null;

  if (!invoiceText && !attachment) {
    await message.reply(HELP_TEXT);
    return;
  }

  try {
    let invoiceJson;

    if (attachment) {
      const mimeType = attachment.contentType?.toLowerCase();

      if (!mimeType) {
        throw new Error(
          "The attachment is missing a content type, so I can't determine whether it is an image or PDF.",
        );
      }

      const attachmentData = await downloadAttachment(attachment);

      if (mimeType.startsWith("image/")) {
        invoiceJson = await extractInvoiceJson({
          kind: "image",
          data: attachmentData,
          mimeType,
          filename: attachment.name,
          instructionText: invoiceText || undefined,
        });
      } else if (mimeType === "application/pdf") {
        invoiceJson = await extractInvoiceJson({
          kind: "file",
          data: attachmentData,
          mimeType,
          filename: attachment.name,
          instructionText: invoiceText || undefined,
        });
      } else {
        throw new Error("Only image and PDF invoice attachments are supported.");
      }
    } else {
      invoiceJson = await extractInvoiceJson({
        kind: "text",
        invoiceText,
      });
    }

    const payload = `\`\`\`json\n${JSON.stringify(invoiceJson, null, 2)}\n\`\`\``;

    if (payload.length <= 1900) {
      await message.reply(payload);
      return;
    }

    await message.reply({
      files: [
        {
          attachment: Buffer.from(JSON.stringify(invoiceJson, null, 2), "utf8"),
          name: "invoice.json",
        },
      ],
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown extraction error";

    await message.reply(
      `I couldn't extract invoice JSON from that message.\n\n${errorMessage}`,
    );
  }
}

async function handleChatMessage(message: Message): Promise<void> {
  const chatText = stripCommandPrefix(message.content, "chat");

  if (!chatText) {
    await message.reply(HELP_TEXT);
    return;
  }

  try {
    const reply = await chatWithJtemize(chatText);
    await message.reply(reply || "I didn't have a useful answer for that yet.");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown chat error";

    await message.reply(`I couldn't answer that right now.\n\n${errorMessage}`);
  }
}

export function createDiscordClient(): Client {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
  });

  client.once("ready", () => {
    const botTag = client.user?.tag ?? "unknown-bot";
    console.log(`Discord bot ready as ${botTag}`);
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot) {
      return;
    }

    const command = getCommand(message);

    if (!command) {
      return;
    }

    if (command === "invoice") {
      await handleInvoiceMessage(message);
      return;
    }

    await handleChatMessage(message);
  });

  return client;
}
