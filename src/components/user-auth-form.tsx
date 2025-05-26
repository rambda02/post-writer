"use client";

import { useState } from "react"; // React　のコアパッケージ
import { signIn } from "next-auth/react"; // NextAuth の認証機能を実装するためのパッケージ　　(OAuth認証、データベース統合、JWTトークン、セッション管理などの認証機能を提供)
import { cn } from "@/lib/utils"; // ユーティリティ関数ライブラリ
import { Input } from "./ui/input"; // 入力コンポーネント (入力フォームを表示する)
import { buttonVariants } from "./ui/button"; // ボタンコンポーネント (ボタンの表示を行う)
import { Icon } from "@/components/Icon"; // アイコンコンポーネント (アイコンを表示する)
import { Label } from "@/components/ui/label"; // ラベルコンポーネント (ラベルを表示する)

export const UserAuthForm = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  // const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isGitHubLoading, setIsGitHubLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="h-10"
              // disabled={isLoading || isGitHubLoading}
              // {...register("email")}
            />
          </div>
          <button className={cn(buttonVariants({ size: "lg" }))}>
            Sign In with Email
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="text-muted-foreground px-2 bg-background">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          onClick={() => {
            setIsGitHubLoading(true);
            signIn("github");
          }}
        >
          {isGitHubLoading ? <Icon.spinner /> : <Icon.github />}
          GitHub
        </button>
        <button
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          onClick={() => {
            setIsGoogleLoading(true);
            signIn("google");
          }}
        >
          {isGoogleLoading ? <Icon.spinner /> : <Icon.google />}
          Google
        </button>
      </div>
    </div>
  );
};
