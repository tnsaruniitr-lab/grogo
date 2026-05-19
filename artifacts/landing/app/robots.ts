import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/demo/*/dashboard"],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Googlebot-Extended"],
        allow: "/",
      },
    ],
    sitemap: "https://growthmonk.ai/sitemap.xml",
    host: "https://growthmonk.ai",
  };
}
