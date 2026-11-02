export const orderSchema = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["new", "paid", "shipped"] },
    id: { type: "string", minLength: 1 },
    tier: { type: "string", enum: ["basic", "silver", "gold"] },
    subtotal: { type: "number", minimum: 0 },
    total: { type: "number", minimum: 0 },
    createdAt: { type: "string", format: "date-time" },
    items: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          sku: { type: "string" },
          price: { type: "number" },
          qty: { type: "integer" },
        },
        required: ["sku", "price", "qty"],
        additionalProperties: false,
      },
    },
  },
  required: ["status", "id", "tier", "subtotal", "total", "createdAt", "items"],
  additionalProperties: false,
} as const;

export const errorSchema = {
  type: "object",
  properties: { code: { type: "string" } },
  required: ["code"],
  additionalProperties: false,
} as const;
export const transitionErrorSchema = {
  type: "object",
  properties: {
    code: { const: "INVALID_TRANSITION" },
    from: { enum: ["new", "paid", "shipped"] },
    to: { enum: ["new", "paid", "shipped"] },
  },
  required: ["code", "from", "to"],
  additionalProperties: false,
} as const;
