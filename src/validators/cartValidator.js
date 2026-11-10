const { z } = require('zod');

const addItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.number().int(),
  quantity: z.number().int().min(1).max(20).default(1)
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(1).max(20)
});

const addLookSchema = z.object({
  lookId: z.string().optional()
});

module.exports = { addItemSchema, updateItemSchema, addLookSchema };