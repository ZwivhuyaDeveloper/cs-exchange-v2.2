import { z } from "zod";

// Ethereum address validation regex
const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

// Base schema for common parameters
const baseParamsSchema = z.object({
  chainId: z.string().regex(/^\d+$/, "Invalid chainId").transform(Number),
  sellToken: z.string().regex(ETH_ADDRESS_REGEX, "Invalid sell token address"),
  buyToken: z.string().regex(ETH_ADDRESS_REGEX, "Invalid buy token address"),
  taker: z.string().regex(ETH_ADDRESS_REGEX, "Invalid taker address").optional(),
  swapFeeRecipient: z.string().regex(ETH_ADDRESS_REGEX, "Invalid fee recipient address").optional(),
  swapFeeBps: z.string().regex(/^\d+$/, "Invalid swap fee BPS").optional(),
  swapFeeToken: z.string().regex(ETH_ADDRESS_REGEX, "Invalid fee token address").optional(),
  tradeSurplusRecipient: z.string().regex(ETH_ADDRESS_REGEX, "Invalid surplus recipient address").optional(),
});

// Price API specific schema - require at least one of sellAmount or buyAmount
export const priceParamsSchema = baseParamsSchema.extend({
  sellAmount: z.string().regex(/^\d+$/, "Invalid sell amount").optional(),
  buyAmount: z.string().regex(/^\d+$/, "Invalid buy amount").optional(),
}).refine((data) => data.sellAmount || data.buyAmount, {
  message: "Either sellAmount or buyAmount is required",
  path: ["sellAmount"],
});

// Quote API specific schema
export const quoteParamsSchema = baseParamsSchema.extend({
  sellAmount: z.string().regex(/^\d+$/, "Invalid sell amount"),
});

// Validation function with simple error handling
export function validateParams(schema: z.ZodTypeAny, searchParams: URLSearchParams) {
  const params = Object.fromEntries(searchParams.entries());
  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map(e => e.message).join(", "));
    }
    throw error;
  }
} 