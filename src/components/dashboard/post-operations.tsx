"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@prisma/client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Icons } from "@/components/icons";

/**
 * 投稿を削除する
 *
 * @param postId - 削除する投稿の ID
 *
 * @returns - true: 削除成功
 *           false: 削除失敗
 */
async function deletePost(postId: string): Promise<boolean> {
  // 投稿削除 API を実行する
  const response = await fetch(`/api/posts/${postId}`, {
    method: "DELETE",
  });

  // API のレスポンスが 200 以外の場合
  if (!response?.ok) {
    toast.error(
      "Something went wrong. Your post was not deleted. Please try again."
    );
    return false;
  }

  return true;
}

interface PostOperationsProps {
  post: Pick<Post, "id" | "title">;
}

export function PostOperations({ post }: PostOperationsProps) {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  return (
    <>
      {/* 投稿編集のドロップダウンメニュー */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <Icons.ellipsis className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={`/editor/${post.id}`} className="flex w-full">
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteAlert(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 投稿削除の確認ダイアログ */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault();

                // 投稿削除ローディング中のフラグをセットする
                setIsDeleteLoading(true);

                // 投稿を削除する
                const deleted = await deletePost(post.id);

                // 投稿削除が成功した場合
                if (deleted) {
                  // 投稿削除ローディング中のフラグをリセットする
                  setIsDeleteLoading(false);

                  // 投稿削除の確認ダイアログを閉じる
                  setShowDeleteAlert(false);

                  // ダッシュボードページをリフレッシュする
                  router.refresh();
                }
              }}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleteLoading ? (
                <Icons.spinner />
              ) : (
                <Icons.trash className="h-4 w-4" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
