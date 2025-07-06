import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Inter as FontSans, Roboto_Mono as FontMono } from "next/font/google";
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";

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

// モノスペースフォントの設定
const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// ビューポートの設定
export const viewport: Viewport = {
  // テーマカラーの設定　（デフォルトはライトモード）
  // モバイルブラウザのステータスバーの色、デスクトップブラウザのアドレスバーの色を設定
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

// メタデータの設定
export const metadata: Metadata = {
  // タイトルの設定
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  // 説明の設定
  description: siteConfig.description,
  // キーワードの設定 (SEO 対策、検索エンジンのためのキーワード)
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Radix UI",
  ],
  // 著者の設定 (コンテンツの著者として、より詳細な情報 （URL を含む） を提供)
  authors: [
    {
      name: "rambda",
      url: "https://rambda.com",
    },
  ],
  // 作成者の設定 （シンプルに作成者名のみを指定）
  creator: "@rambda",
  // Open Graph の設定 (SEO 対策、 SNS シェアのための設定)
  openGraph: {
    type: "website",
    locale: "ja",
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    images: siteConfig.ogImage,
  },
  // Twitter の設定 (SEO 対策、 SNS シェアのための設定)
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: siteConfig.ogImage,
    creator: "@rambda",
  },
  // アイコンの設定
  icons: {
    icon: "/favicon.ico",
    // shortcut: "/favicon.ico",
    // apple: "/favicon.ico",
  },
  // ウェブアプリケーションの設定を定義
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased", // フォントが読み込まれるまでは font-sans が適用される
          fontSans.variable, // フォントの設定
          fontHeading.variable, // ヘッダーのフォントの設定
          fontMono.variable // モノスペースフォントの設定
        )}
      >
        {/* テーマプロバイダー */}
        <ThemeProvider
          attribute="class" // テーマの属性 (class を使用してテーマを適用)
          defaultTheme="system" // デフォルトのテーマ
          enableSystem // システムテーマの有効化
          disableTransitionOnChange // トランジションの無効化
        >
          {children}
          <Analytics /> {/* アナリティクス */}
          <Toaster /> {/* トースター */}
          <TailwindIndicator /> {/* インジケーター */}
        </ThemeProvider>
      </body>
    </html>
  );
}
