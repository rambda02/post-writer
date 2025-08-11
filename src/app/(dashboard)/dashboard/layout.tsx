import { notFound } from "next/navigation";

import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { DashboardNav } from "@/components/dashboard/nav";
import { UserAccountNav } from "@/components/dashboard/user-account-nav";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // 認証ユーザーを取得する
  const user = await getCurrentUser();

  // 認証ユーザーを取得できなかった場合
  if (!user) {
    // 404 エラーを返す
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          {/* メインナビゲーション */}
          <MainNav items={dashboardConfig.mainNav} />

          {/* ユーザーアカウントナビゲーション */}
          <UserAccountNav
            user={{
              name: user.name,
              image: user.image,
              email: user.email,
            }}
          />
        </div>
      </header>

      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        {/* サイドバー */}
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={dashboardConfig.sidebarNav} />
        </aside>

        {/* メインコンテンツ */}
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>

      {/* フッター */}
      <SiteFooter className="border-t" />
    </div>
  );
}
