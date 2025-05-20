import Link from "next/link"; // リンク
import { cn } from "@/lib/utils"; //　ユーティリティ
import { buttonVariants } from "@/components/ui/button"; // ボタン
import { MainNav } from "@/components/main-nav"; // メインナビゲーション
import { SiteFooter } from "@/components/site-footer"; // フッター
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
