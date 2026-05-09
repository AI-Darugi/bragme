import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://bragme.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/feed"],
        // /preview is the internal theme gallery; /api is server-only;
        // /card/[id] pages aren't disallowed (their meta is fine to share)
        // but we don't volunteer them in the sitemap either.
        disallow: ["/api/", "/preview"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
