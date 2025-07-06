import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form";
import { Icons } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default function Register() {
  return (
    <div className="container grid flex-col lg:grid-cols-2 h-screen w-screen items-center justify-center lg:max-w-none lg:px-0">
      <Link
        href={"/login"}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </Link>
      <div className="h-full bg-muted lg:block hidden" />
      <div className="lg:p-8">
        <div className="mx-auto w-full sm:w-[350px] flex flex-col justify-center space-y-6">
          {/* ヘッダー */}
          <div className="flex flex-col text-center space-y-2">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>

          {/* ユーザー認証フォーム */}
          <UserAuthForm />

          {/* 利用規約とプライバシーポリシー */}
          <p className="text-muted-foreground px-8 text-center text-sm">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
