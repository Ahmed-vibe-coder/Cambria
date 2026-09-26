import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cambria.edu";
  const now = new Date();

  const publicRoutes = [
    "",
    "/about",
    "/programs",
    "/majors",
    "/services",
    "/team",
    "/contact",
    "/verify",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/programs" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/verify" ? 0.9 : 0.8,
  }));
}
