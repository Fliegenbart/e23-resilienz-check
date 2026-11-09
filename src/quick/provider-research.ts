import { z } from "zod";

export const PROVIDER_SOURCE_DOMAINS = [
  "openai.com",
  "anthropic.com",
  "claude.com",
  "google.com",
  "ai.google.dev",
  "blog.google",
  "gemini.google",
  "chatgpt.com",
  "microsoft.com",
] as const;

export function isProviderSourceUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      (!url.port || url.port === "443") &&
      PROVIDER_SOURCE_DOMAINS.some(
        (domain) =>
          url.hostname === domain || url.hostname.endsWith(`.${domain}`),
      )
    );
  } catch {
    return false;
  }
}

export const providerSourceSchema = z
  .object({
    id: z.string().regex(/^S[1-8]$/),
    title: z.string().min(1).max(180),
    url: z
      .string()
      .url()
      .refine(isProviderSourceUrl, "Keine offizielle Anbieterquelle."),
    excerpt: z.string().min(1).max(1800),
  })
  .strict();

export const providerResearchSchema = z
  .object({
    status: z.enum(["retrieved", "unavailable"]),
    retrievedAt: z.iso.datetime({ offset: true }),
    topics: z.array(z.string().max(80)).max(4),
    sources: z.array(providerSourceSchema).max(8),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (
      (value.status === "retrieved") !== value.sources.length > 0 ||
      new Set(value.sources.map((s) => s.id)).size !== value.sources.length
    )
      ctx.addIssue({
        code: "custom",
        message: "Quellenstatus passt nicht zu den Belegen.",
      });
  });
export type ProviderResearch = z.infer<typeof providerResearchSchema>;

export const normalizedQuote = (value: string) =>
  value.replace(/\s+/g, " ").trim();
export function hasSourceQuote(source: string, quote: string) {
  return (
    quote.trim().length >= 12 &&
    normalizedQuote(source).includes(normalizedQuote(quote))
  );
}
