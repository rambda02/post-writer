import { DashboardHeader } from "@/components/dashboard-header";
import { DashBoardShell } from "@/components/dashboard-shell";
import { PostCreateButton } from "@/components/post-create-button";

export default function DashboardPage() {
  return (
    <DashBoardShell>
      <DashboardHeader heading="記事投稿" text="記事の作成と管理">
        <PostCreateButton />
      </DashboardHeader>
    </DashBoardShell>
  );
}
