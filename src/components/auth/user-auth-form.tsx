"use client";

import { useState, Suspense } from "react"; // React　のコアパッケージ
import { useSearchParams } from "next/navigation"; // クエリパラメータを取得するためのパッケージ
import { signIn } from "next-auth/react"; // NextAuth の認証機能を実装するためのパッケージ　　(OAuth認証、データベース統合、JWTトークン、セッション管理などの認証機能を提供する)
import { userAuthSchema } from "@/lib/validations/auth"; // バリデーションスキーマ (バリデーションを行うためのスキーマ)
import { useForm } from "react-hook-form"; // フォーム管理を簡単にするためのライブラリ (フォームの状態管理、バリデーション、エラーハンドリングを効率的に行うための一連のフックを提供する)
import { z } from "zod"; // バリデーションを行うためのパッケージ
import { zodResolver } from "@hookform/resolvers/zod"; // バリデーションを行うためのライブラリ (バリデーションを行うためのスキーマを解決する)
import { cn } from "@/lib/utils"; // ユーティリティ関数ライブラリ
import { Input } from "@/components/ui/input"; // 入力コンポーネント (入力フォームを表示する)
import { buttonVariants } from "@/components/ui/button"; // ボタンコンポーネント (ボタンの表示を行う)
import { Icon } from "@/components/Icon"; // アイコンコンポーネント (アイコンを表示する)
import { Label } from "@/components/ui/label"; // ラベルコンポーネント (ラベルを表示する)
import { toast } from "sonner"; // トーストメッセージを表示するためのパッケージ (通知を表示する)

// フォームのデータ型を定義 (バリデーションを行う)
type FormData = z.infer<typeof userAuthSchema>;

// 内部コンポーネントを作成
function UserAuthFormContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState<boolean>(false); // ローディング状態を管理する
  const [isGitHubLoading, setIsGitHubLoading] = useState<boolean>(false); // GitHub ローディング状態を管理する
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false); // Google ローディング状態を管理する
  const searchParams = useSearchParams(); // クエリパラメータを取得する

  // フォームのデータを管理する (主にバリデーションを行う)
  const {
    register, // フォーム要素を登録する関数
    handleSubmit, // フォーム送信を処理する関数
    formState: { errors }, // バリデーションエラー情報
  } = useForm<FormData>({
    // バリデーションを行う
    resolver: zodResolver(userAuthSchema),
  });

  /**
   * フォームのデータを送信する
   * @param data (FormData)
   * @returns トーストメッセージを表示する
   */
  async function onSubmit(data: FormData) {
    // ローディング状態を有効にする
    setIsLoading(true);

    // メールアドレスを送信する
    const signInResult = await signIn("email", {
      email: data.email.toLowerCase(), // メールアドレスを小文字に変換する
      redirect: false, // リダイレクトを無効にする
      callbackUrl: searchParams?.get("from") || "/dashboard", // リダイレクト先のURLを設定する
    });

    // ローディング状態を無効にする
    setIsLoading(false);

    // サインインに失敗した場合
    if (!signInResult?.ok) {
      return toast.error("Something went wrong.", {
        description: "Your sign in request failed. Please try again.",
        duration: 5000, // 5秒間表示（ミリ秒単位）
      });
    }

    // サインインに成功した場合
    return toast.success("Check your email", {
      description: "We sent you a login link. Be sure to check your spam too.",
      duration: 5000, // 5秒間表示（ミリ秒単位）
    });
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <button
            className={cn(buttonVariants({ size: "lg" }))}
            disabled={isLoading}
          >
            {isLoading && <Icon.spinner />}
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
}

// メインコンポーネント
export const UserAuthForm = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserAuthFormContent {...props} />
    </Suspense>
  );
};
