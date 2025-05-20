import Link from "next/link"; // Next.js のリンクコンポーネント (リンクを表示する)
import { cn } from "@/lib/utils"; // ユーティリティ関数ライブラリ
import { buttonVariants } from "@/components/ui/button"; // ボタンコンポーネント (ボタンの表示を行う)
import { MainNav } from "@/components/main-nav"; // メインナビゲーションコンポーネント (メインナビゲーションの表示を行う)
import { SiteFooter } from "@/components/site-footer"; // フッターコンポーネント (フッターの表示を行う)
import { marketingConfig } from "@/config/marketing"; // マーケティング設定

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ヘッダー */}
      <header className="container z-40 bg-background">
        <div className="flex items-center justify-between h-20 py-6">

          {/* メインナビゲーション */}
          <MainNav items={marketingConfig.mainNav} />

          {/* ログインボタン */}
          <nav>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1">{children}</main>

      {/* フッター */}
      <SiteFooter />
    </div>
  );
}
