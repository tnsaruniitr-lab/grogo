import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://growthmonk.ai";

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
