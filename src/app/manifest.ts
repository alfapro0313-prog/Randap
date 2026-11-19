import type { MetadataRoute } from "next";

/** PWA manifesti — Randap telefonga ilova sifatida o'rnatiladi */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Randap Video platforma",
    short_name: "Randap",
    description:
      "Videolar va shorts joylash, ko'rish, layk bosish, izoh qoldirish va obuna bo'lish mumkin bo'lgan video platforma.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0a0a",
    theme_color: "#E7000B",
    lang: "uz",
    categories: ["entertainment", "social"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
