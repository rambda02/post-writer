"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Icons } from "@/components/Icons";
import { VariantProps } from "class-variance-authority";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PostCreateButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
}

export const PostCreateButton = ({
  className,
  variant,
  ...props
}: PostCreateButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    setIsLoading(true);

    const response = await fetch("api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Untitled Post",
      }),
    });

    setIsLoading(false);

    if (!response.ok) {
      return toast.error("問題が発生しました。");
    }

    const post = await response.json();

    router.refresh();
    router.push(`/editor/${post.id}`);
  };

  return (
    <button
      className={cn(
        buttonVariants({ variant }),
        { "cursor-not-allowed opacity-60": isLoading },
        className
      )}
      onClick={onClick}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Icons.spinner /> : <Icons.add />}
      新しい投稿
    </button>
  );
};
