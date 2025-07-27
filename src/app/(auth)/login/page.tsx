import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form";
import { Icons } from "@/components/icons";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function Login() {
  return (
    <div className="container flex flex-col items-center justify-center h-screen w-screen">
      {/* バックボタン */}
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <Icons.chevronLeft />
        Back
      </Link>
      <div className="mx-auto w-full sm:w-[350px] flex flex-col justify-center space-y-6">
        <div className="flex flex-col text-center space-y-2">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>

        {/* ユーザー認証フォーム */}
        <UserAuthForm />

        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/register" className="underline underline-offset-4">
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
