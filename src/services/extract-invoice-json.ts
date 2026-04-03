import { invoiceSchema, type InvoiceJson } from "../domain/invoice-schema.js";
import { mastra } from "../mastra/index.js";

type InvoiceExtractionInput =
  | {
      kind: "text";
      invoiceText: string;
    }
  | {
      kind: "image";
      data: Buffer;
      mimeType: string;
      filename?: string;
      instructionText?: string;
    }
  | {
      kind: "file";
      data: Buffer;
      mimeType: string;
      filename?: string;
      instructionText?: string;
    };

function getExtractionInstruction(extraInstruction?: string): string {
  const baseInstruction = [
    "Extract invoice data from the provided content.",
    "Return the result using the requested structured output schema.",
    "Use null for missing fields.",
    "Preserve line items separately from document-level totals.",
    "Normalize dates to YYYY-MM-DD when safe.",
    "Use numbers for monetary values and quantities when clear enough to infer safely.",
    "If the document is not clearly an invoice, extract the closest invoice-like structure and explain that in notes.",
  ].join(" ");

  if (!extraInstruction) {
    return baseInstruction;
  }

  return `${baseInstruction} Additional context from the user: ${extraInstruction}`;
}

async function generateStructuredInvoice(
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "image"; image: Buffer; mimeType: string }
        | { type: "file"; data: Buffer; mimeType: string; filename?: string }
      >,
): Promise<InvoiceJson> {
  const agent = mastra.getAgent("jtemizeAgent");
  const result = await agent.generate(
    [
      {
        role: "user",
        content,
      },
    ],
    {
      structuredOutput: {
        schema: invoiceSchema,
      },
    },
  );

  const parsed = result.object;

  if (!parsed) {
    throw new Error("The model did not return a structured invoice object.");
  }

  return invoiceSchema.parse(parsed);
}

export async function extractInvoiceJson(
  input: InvoiceExtractionInput,
): Promise<InvoiceJson> {
  if (input.kind === "text") {
    return generateStructuredInvoice(getExtractionInstruction(input.invoiceText));
  }

  if (input.kind === "image") {
    return generateStructuredInvoice([
      {
        type: "text",
        text: getExtractionInstruction(input.instructionText),
      },
      {
        type: "image",
        image: input.data,
        mimeType: input.mimeType,
      },
    ]);
  }

  return generateStructuredInvoice([
    {
      type: "text",
      text: getExtractionInstruction(input.instructionText),
    },
    {
      type: "file",
      data: input.data,
      mimeType: input.mimeType,
      filename: input.filename,
    },
  ]);
}
