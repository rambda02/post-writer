import { DashboardHeader } from "@/components/dashboard-header";
import { DashBoardShell } from "@/components/dashboard-shell";
import { PostCreateButton } from "@/components/post-create-button";
import { PostItem } from "@/components/post-item";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const posts = await db.post.findMany({
    where: {
      authorId: user.id,
    },
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <DashBoardShell>
      <DashboardHeader heading="記事投稿" text="記事の作成と管理">
        <PostCreateButton />
      </DashboardHeader>
      {posts.length ? (
        <div className="divide-y border rounded-md">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="text-sm text-muted-foreground">
            <p>記事がありません。</p>
          </div>
        </div>
      )}
    </DashBoardShell>
  );
}
