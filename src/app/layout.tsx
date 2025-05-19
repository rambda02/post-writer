import type { Metadata, Viewport } from "next"; // next.js のコアパッケージ
import "./globals.css"; // グローバルスタイルシート
import { Inter as FontSans } from "next/font/google"; // グローバルフォント
import localFont from "next/font/local"; // ローカルフォント
import { siteConfig } from "@/config/site"; // サイト設定
import { cn } from "@/lib/utils"; // ユーティリティ
import { Toaster } from "@/components/ui/sonner"; // トースター
import { Analytics } from "@/components/analytics"; // アナリティクス
import { TailwindIndicator } from "@/components/tailwind-indicator"; // インジケーター
import { ThemeProvider } from "@/components/theme-provider"; // テーマプロバイダー

// フォントの設定
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// ヘッダーのフォントの設定
const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "shadcn/ui",
    "NextAuth",
    "Prisma",
  ],
  authors: [
    {
      name: "rambda",
      url: "https://rambda.com",
    },
  ],
  creator: "rambda",
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
    creator: "@rambda",
  },
  icons: {
    icon: "/favicon.ico",
    // shortcut: "/favicon-16x16.png",
    // apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`, // ウェブアプリケーションの設定を定義
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased", // フォントが読み込まれるまではfont-sansが適用される
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
          <Toaster />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
