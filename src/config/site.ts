import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  // サイトの名前
  name: "Post Writer",
  // サイトの説明
  description:
    "An open source application built using the new router, server components and everything new in Next.js 15.",
  // サイトのURL
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  // サイトのOGP画像
  ogImage: `${process.env.NEXT_PUBLIC_APP_URL}/og.jpg`,
  // リンクの設定
  links: {
    x: "https://x.com/rambda555", // Xのリンク
    github: "https://github.com/rambda555/post-writer", // GitHubのリンク
  },
};
