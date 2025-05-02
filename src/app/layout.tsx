import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { siteConfig } from "@/config/site";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Next.js", "React", "Tailwind CSS", "shadcn/ui"],
  authors: [
    {
      name: "Lambda878",
      url: siteConfig.url,
    },
  ],
  openGraph: {
    type: "website",
    locale: "ja",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.png`],
    creator: "@Lambda878",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={cn(
          notoSansJP.className,
          "bg-background min-h-screen antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}
