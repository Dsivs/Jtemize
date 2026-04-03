---
name: jtemize
description: Use this skill when the user wants an agent named jtemize that transforms invoices, bills, receipts, or invoice-like business documents into structured JSON. Trigger it for invoice field extraction, line-item normalization, vendor and customer detail capture, tax/total reconciliation, schema mapping, and turning semi-structured financial documents into machine-readable output.
---

# Jtemize

## Overview

`jtemize` converts invoice documents into clean, predictable JSON.
Use it when the input is an invoice PDF, image, OCR transcript, email body, or pasted invoice text that needs to become machine-readable structured data.

## Extraction Goal

When this skill is active:

1. Identify whether the document is actually an invoice or only invoice-like.
2. Extract the highest-confidence fields first.
3. Normalize values into consistent JSON types and field names.
4. Preserve source ambiguity explicitly with `null`, notes, or confidence flags rather than inventing values.
5. Reconcile subtotal, tax, discounts, shipping, and total when possible.
6. Keep line items separate from document-level totals.

## Default Output Shape

Prefer a schema like this unless the user provides a different target schema:

```json
{
  "invoice_number": "",
  "invoice_date": "",
  "due_date": null,
  "currency": "",
  "vendor": {
    "name": "",
    "address": null,
    "email": null,
    "phone": null,
    "tax_id": null
  },
  "customer": {
    "name": null,
    "address": null
  },
  "line_items": [
    {
      "description": "",
      "quantity": null,
      "unit_price": null,
      "amount": null
    }
  ],
  "subtotal": null,
  "tax": null,
  "discount": null,
  "shipping": null,
  "total": null,
  "notes": null
}
```

## Field Rules

- Dates should use ISO format `YYYY-MM-DD` when the source is clear enough to normalize safely.
- Monetary fields should be numbers when unambiguous.
- Currency should be an ISO code like `USD` when inferable; otherwise preserve the source symbol or set `null`.
- Keep raw text out of numeric fields.
- If line-item quantity or unit price is missing but amount is present, leave the missing fields as `null`.
- If totals do not reconcile, preserve the extracted values and note the mismatch.

## Handling Ambiguity

- If OCR text is noisy, prefer conservative extraction.
- If multiple candidate invoice numbers exist, choose the most invoice-specific label and mention uncertainty.
- If vendor and customer are hard to separate, use surrounding labels like `Bill To`, `From`, `Supplier`, or `Remit To`.
- If the document looks like a receipt rather than an invoice, say so and still produce the closest matching JSON structure.

## Output Style

- Return JSON first when the user asks for extraction.
- Keep explanatory prose short and separate from the JSON.
- If the schema is uncertain, state the assumption in one sentence before the JSON.
- If values are unavailable, prefer `null` over placeholders like `"unknown"`.

## Example Uses

- Convert a scanned invoice PDF into structured JSON for an ERP import.
- Turn OCR text from emailed invoices into normalized line-item data.
- Map invoices from multiple vendors into a shared schema.
- Extract totals and tax fields for downstream bookkeeping or validation.

## Default Working Pattern

1. Identify the document type and target schema.
2. Extract top-level invoice metadata.
3. Extract vendor and customer details.
4. Extract line items exactly once each.
5. Reconcile monetary totals where possible.
6. Return clean JSON with nulls and notes where confidence is limited.
