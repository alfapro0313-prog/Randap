import type { MetadataRoute } from "next";
import { LANDING_LINKS } from "@/components/randap/landing-shared";

const SITE = "https://randap.vercel.app";

/**
 * Sitemap — barcha ochiq (loginsiz) landing sahifalari bilan.
 * Yangi landing qo'shilsa LANDING_LINKS ro'yxatiga yozilsa kifoya.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const priorityOf = (path: string): number => {
    if (path === "/") return 1;
    if (path === "/menyu" || path === "/haqida") return 0.9;
    return 0.8;
  };

  const landings = LANDING_LINKS.map((l) => ({
    url: `${SITE}${l.href}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: priorityOf(l.href),
  }));

  return [
    {
      url: SITE,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...landings,
  ];
}
