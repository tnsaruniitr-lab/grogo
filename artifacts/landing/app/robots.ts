import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Googlebot-Extended"],
        allow: "/",
      },
    ],
    sitemap: "https://answermonk.ai/grow/sitemap.xml",
    host: "https://answermonk.ai",
  };
}
