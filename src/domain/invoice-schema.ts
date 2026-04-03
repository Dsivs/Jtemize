import { z } from "zod";

export const invoiceSchema = z.object({
  invoice_number: z.string().nullable(),
  invoice_date: z.string().nullable(),
  due_date: z.string().nullable(),
  currency: z.string().nullable(),
  vendor: z.object({
    name: z.string().nullable(),
    address: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    tax_id: z.string().nullable(),
  }),
  customer: z.object({
    name: z.string().nullable(),
    address: z.string().nullable(),
  }),
  line_items: z.array(
    z.object({
      description: z.string(),
      quantity: z.number().nullable(),
      unit_price: z.number().nullable(),
      amount: z.number().nullable(),
    }),
  ),
  subtotal: z.number().nullable(),
  tax: z.number().nullable(),
  discount: z.number().nullable(),
  shipping: z.number().nullable(),
  total: z.number().nullable(),
  notes: z.string().nullable(),
});

export type InvoiceJson = z.infer<typeof invoiceSchema>;
