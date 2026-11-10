const { z } = require('zod');

const productSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  vendor: z.string().optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0),
  currency: z.string().optional(),
  image: z.string().url(),
  images: z.array(z.string().url()).optional(),
  sizes: z.array(z.string()).optional(),
  variants: z.array(z.object({ variantId: z.number().int(), size: z.string().min(1), available: z.boolean().optional(), sku: z.string().optional() })).optional(),
  originalProductUrl: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional()
});

module.exports = { productSchema };