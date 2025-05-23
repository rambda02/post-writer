import type { Metadata, Viewport } from "next"; // Next.js のコアパッケージ
import "@/styles/globals.css"; // グローバルスタイルシート
import { Inter as FontSans } from "next/font/google"; // グローバルフォント
import localFont from "next/font/local"; // ローカルフォント
import { siteConfig } from "@/config/site"; // サイト設定
import { cn } from "@/lib/utils"; // ユーティリティ関数ライブラリ
import { Toaster } from "@/components/ui/sonner"; // トースターコンポーネント (トースターの表示を行う)
import { Analytics } from "@/components/analytics"; // アナリティクスコンポーネント (Vercel Analytics の設定を有効化にする)
import { TailwindIndicator } from "@/components/tailwind-indicator"; // インジケーターコンポーネント (Tailwind CSS のインジケーターの表示を行う)
import { ThemeProvider } from "@/components/theme-provider"; // テーマプロバイダーコンポーネント (ライトモード・ダークモードの切り替えを制御する)

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

// ビューポートの設定
export const viewport: Viewport = {
  // テーマカラーの設定　（デフォルトはライトモード）
  // モバイルブラウザのステータスバーの色、デスクトップブラウザのアドレスバーの色を設定
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" }, // ライトモードのテーマカラー
    { media: "(prefers-color-scheme: dark)", color: "black" }, // ダークモードのテーマカラー
  ],
};

// メタデータの設定
export const metadata: Metadata = {
  // タイトルの設定
  title: {
    default: siteConfig.name, // デフォルトのタイトル
    template: `%s | ${siteConfig.name}`, // テンプレートのタイトル
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
    type: "website", // ウェブサイトの設定
    locale: "ja", // 言語の設定
    siteName: siteConfig.name, // サイトの名前
    url: siteConfig.url, // サイトの URL
    title: siteConfig.name, // タイトル
    description: siteConfig.description, // 説明
    images: siteConfig.ogImage, // 画像
  },
  // Twitter の設定 (SEO 対策、 SNS シェアのための設定)
  twitter: {
    card: "summary_large_image", // カードの設定
    title: siteConfig.name, // タイトル
    description: siteConfig.description, // 説明
    images: siteConfig.ogImage, // 画像
    creator: "@rambda", // 作成者
  },
  // アイコンの設定
  icons: {
    icon: "/favicon.ico", // アイコンの設定
    // shortcut: "/favicon-16x16.png", // ショートカットアイコンの設定
    // apple: "/apple-touch-icon.png", // iOS デバイスのアイコンの設定
  },
  manifest: `${siteConfig.url}/site.webmanifest`, // ウェブアプリケーションの設定を定義
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
          fontHeading.variable // ヘッダーのフォントの設定
        )}
      >
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
        </ThemeProvider> {/* テーマプロバイダー */}
      </body>
    </html>
  );
}
