import { DashboardHeader } from "@/components/dashboard-header";
import { DashBoardShell } from "@/components/dashboard-shell";

export default function DashboardPage() {
  return (
    <DashBoardShell>
      <DashboardHeader heading="記事投稿" text="記事の作成と管理">
        Create
      </DashboardHeader>
    </DashBoardShell>
  );
}
