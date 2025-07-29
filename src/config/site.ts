import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Post Writer",
  description:
    "An open source application built using the new router, server components and everything new in Next.js 15.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: `${process.env.NEXT_PUBLIC_APP_URL}/og.jpg`,
  github: {
    htmlUrl: "https://github.com/rambda02/post-writer",
    apiUrl: "https://api.github.com/repos/rambda02/post-writer"
  },
  links: {
    x: "https://x.com/rambda02"
  }
};
