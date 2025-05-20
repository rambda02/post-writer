import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { marketingConfig } from "@/config/marketing";

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
