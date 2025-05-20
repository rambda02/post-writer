import Link from "next/link"; // リング
import { cn } from "@/lib/utils"; // ユーティリティ
import { buttonVariants } from "@/components/ui/button"; // ボタン
import { siteConfig } from "@/config/site"; // サイト設定

export const HeroSection = () => {
  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="w-full mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
        {/* ツイッターリンク */}
        <Link
          href={siteConfig.links.x}
          className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
          target="_blank"
        >
          Follow along on Twitter
        </Link>

        {/* 見出し */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl">
          An example app built using Next.js 13 server components.
        </h1>

        {/* 説明 */}
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          I&apos;m building a web app with Next.js 13 and open sourcing
          everything. Follow along as we figure this out together.
        </p>

        {/* ボタングループ */}
        <div className="space-x-4">
          {/* ログインボタン */}
          <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
            Get Started
          </Link>

          {/* GitHub　リンク */}
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            GitHub
          </Link>
        </div>
      </div>
    </section>
  );
};
