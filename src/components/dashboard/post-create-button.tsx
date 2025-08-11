"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { toast } from "sonner";

interface PostCreateButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  variant?: "default" | "outline";
}

export function PostCreateButton({
  className,
  variant,
  ...props
}: PostCreateButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false); // ローディング状態を管理する

  /**
   * 投稿を作成する
   *
   * @returns {Promise<void>}
   */
  async function handleCreatePost(): Promise<void> {
    // ローディングを開始する
    setIsLoading(true);

    // 投稿を作成する
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Untitled Post",
      }),
    });

    // ローディングを終了する
    setIsLoading(false);

    // 投稿が作成できなかった場合
    if (!response?.ok) {
      // プランの制限に達した場合
      if (response.status === 402) {
        toast.error(
          "Limit of 3 posts reached. Please upgrade to the PRO plan."
        );
        return;
      }

      // 投稿が作成できなかった場合
      toast.error(
        "Something went wrong. Your post was not created. Please try again."
      );
      return;
    }

    // 投稿を取得する
    const post = await response.json();

    router.refresh(); // ページを更新する (ここで更新しないと、新しい投稿が表示されない可能性がある)

    router.push(`/editor/${post.id}`); // 編集ページに遷移する
  }

  return (
    <button
      onClick={handleCreatePost}
      className={cn(
        buttonVariants({ variant }),
        {
          "cursor-not-allowed opacity-60": isLoading,
        },
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Icons.spinner /> : <Icons.add className="mr-2 h-4 w-4" />}
      New post
    </button>
  );
}
