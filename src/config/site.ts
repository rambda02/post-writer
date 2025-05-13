import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Taxonomy",
  description:
    "An open source application built using the new router, server components and everything new in Next.js 15.",
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  ogImage: `${process.env.NEXTAUTH_URL}/og.png`,
  links: {
    x: "https://x.com/rambda555",
    github: "https://github.com/rambda555/post-writer",
  },
};
