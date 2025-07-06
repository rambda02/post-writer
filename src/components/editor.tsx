"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import TextareaAutosize from "react-textarea-autosize";
import type EditorJS from "@editorjs/editorjs";
import { Post } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postPatchSchema, postPatchSchemaType } from "@/lib/validations/post";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/Icons";

interface EditorProps {
  post: Pick<Post, "id" | "title" | "content" | "published">;
}

export const Editor = ({ post }: EditorProps) => {
  const router = useRouter();
  const ref = useRef<EditorJS | undefined>(undefined);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;

    const body = postPatchSchema.parse(post);

    const editor = new EditorJS({
      holder: "editor",
      onReady: () => {
        ref.current = editor;
      },
      placeholder: "ここに記事を書く",
      inlineToolbar: true,
      data: body.content,
      tools: {
        header: Header,
        linkTool: LinkTool,
        list: List,
        code: Code,
      },
    });
  }, [post]);

  /**
   * ページリロード時はサーバーサイドでのレンダリングに一回実行された扱いになる　（　実際には実行されない　）
   * そのため、StrictModeを有効にしていてもページリロード時は一回のみの実行になる
   * ページ遷移時は2回実行される
   */

  // StrictModeを有効にしている場合、editorが2回生成されてしまう
  // そのため、useEffectを使ってマウントステータスを管理する
  useEffect(() => {
    // このコンポーネントがマウントされている場合
    if (typeof window !== "undefined") {
      // マウントステータスをtrueにする
      setIsMounted(true);
    }
  }, []);

  // マウントステータスがtrueの場合はエディターを初期化する
  useEffect(() => {
    // マウントステータスがtrueの場合
    if (isMounted) {
      // エディターを初期化する
      initializeEditor();
    }

    return () => {
      // エディターを破棄する
      ref.current?.destroy();
      ref.current = undefined;
    };
  }, [isMounted, initializeEditor]);

  const { register, handleSubmit } = useForm<postPatchSchemaType>({
    resolver: zodResolver(postPatchSchema),
  });

  const onSubmit = async (data: postPatchSchemaType) => {
    setIsSaving(true);
    const blocks = await ref.current?.save();

    const response = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        content: blocks,
      }),
    });

    setIsSaving(false);

    if (!response.ok) {
      return toast.error("問題が発生しました");
    }

    router.refresh();

    return toast.success("記事が更新されました。");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link
              href={"/dashboard"}
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              戻る
            </Link>
            <p className="text-sm text-muted-foreground">公開</p>
          </div>
          <button className={cn(buttonVariants())} type="submit">
            {isSaving && <Icons.spinner />}
            <span>保存</span>
          </button>
        </div>
        <div className="w-[800px] mx-auto">
          <TextareaAutosize
            id="title"
            autoFocus
            defaultValue={post.title}
            placeholder="Post Title"
            className="w-full resize-none overflow-hidden bg-transparent text-5xl focus:outline-none font-bold"
            {...register("title")}
          />
        </div>
        <div id="editor" className="min-h-[500px]" />
        <p className="text-sm text-gray-500">
          Use
          <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
            Tab
          </kbd>
          to open the command menu
        </p>
      </div>
    </form>
  );
};
