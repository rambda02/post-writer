"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { Icons } from "@/components/icons";

// Zod スキーマから TypeScript の型を自動生成する
type FormData = z.infer<typeof userAuthSchema>;

function UserAuthFormContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState<boolean>(false); // ローディング状態を管理する
  const [isGitHubLoading, setIsGitHubLoading] = useState<boolean>(false); // GitHub ローディング状態を管理する
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false); // Google ローディング状態を管理する
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  /**
   * サインイン処理を実行する
   *
   * @param data - フォームデータ
   *
   * @returns {void}
   */
  async function handleSignIn(data: FormData): Promise<void> {
    // ローディング状態を有効にする
    setIsLoading(true);

    // サインイン処理を実行する
    const signInResult = await signIn("email", {
      email: data.email.toLowerCase(), // メールアドレスを小文字に変換する
      redirect: false, // デフォルトのリダイレクトを無効にする
      callbackUrl: searchParams?.get("callbackUrl") || "/dashboard", // リダイレクト先の URL を設定する
    });

    // ローディング状態を無効にする
    setIsLoading(false);

    // サインインに失敗した場合
    if (!signInResult?.ok) {
      toast.error("Something went wrong.", {
        description: "Your sign in request failed. Please try again.",
        duration: 5000, // 5秒間表示　（ミリ秒単位）
      });
      return;
    }

    // サインインに成功した場合
    toast.success("Check your email", {
      description: "We sent you a login link. Be sure to check your spam too.",
      duration: 5000, // 5秒間表示　（ミリ秒単位）
    });
    return;
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(handleSignIn)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>

            {/* メールアドレスの入力フォーム */}
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="h-10"
              disabled={isLoading || isGitHubLoading || isGoogleLoading}
              {...register("email")}
            />

            {/* バリデーションエラーがある場合はエラーメッセージを表示する */}
            {errors?.email && (
              <p className="px-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* サインインボタン */}
          <button
            className={cn(buttonVariants({ size: "lg" }))}
            disabled={isLoading}
          >
            {isLoading && <Icons.spinner />}
            Sign In with Email
          </button>
        </div>
      </form>

      {/* 区切り線 */}
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
        {/* GitHub ボタン */}
        <button
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          onClick={() => {
            setIsGitHubLoading(true);
            signIn("github");
          }}
        >
          {isGitHubLoading ? <Icons.spinner /> : <Icons.github />}
          GitHub
        </button>

        {/* Google ボタン */}
        <button
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          onClick={() => {
            setIsGoogleLoading(true);
            signIn("google");
          }}
        >
          {isGoogleLoading ? <Icons.spinner /> : <Icons.google />}
          Google
        </button>
      </div>
    </div>
  );
}

export const UserAuthForm = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserAuthFormContent {...props} />
    </Suspense>
  );
};
