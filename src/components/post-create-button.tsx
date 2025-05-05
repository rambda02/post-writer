"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Icon } from "./icon";
import { VariantProps } from "class-variance-authority";

interface PostCreateButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
}

export const PostCreateButton = ({
  className,
  variant,
  ...props
}: PostCreateButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = () => {};

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
      {isLoading ? <Icon.spinner /> : <Icon.add />}
      新しい投稿
    </button>
  );
};
