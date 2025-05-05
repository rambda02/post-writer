import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { dashboardConfig } from "@/config/dashboard";
import { DashBoardNav } from "@/components/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container mx-auto px-8 flex items-center justify-between py-4 h-16">
          <MainNav items={dashboardConfig.mainNav} />
        </div>
      </header>
      <div className="container mx-auto px-8 grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden md:flex w-[200px] flex-col">
          <DashBoardNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex flex-col w-full flex-1 overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
