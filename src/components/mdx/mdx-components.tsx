import Image from "next/image";
import { useMDXComponent } from "next-contentlayer2/hooks";

import { cn } from "@/lib/utils";
import { Callout } from "@/components/callout";
import { MdxCard } from "@/components/mdx-card";

const components = {
  // h2
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),

  // リンク
  a: ({
    className,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),

  // 本文
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),

  // 引用
  blockquote: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn("text-muted-foreground border-l-2", className)}
      {...props}
    />
  ),

  // コードブロック、コードスパン
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm before:content-none after:content-none",
        className
      )}
      {...props}
    />
  ),

  Image, // 画像
  Callout, // コールアウト
  Card: MdxCard, // カード
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  // MDX コンテンツをコンポーネントに変換する
  const Component = useMDXComponent(code);

  return (
    <div className="prose max-w-none dark:prose-invert">
      <Component components={components} />
    </div>
  );
}
