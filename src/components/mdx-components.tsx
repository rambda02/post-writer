import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMDXComponent } from "next-contentlayer2/hooks";
import { Callout } from "@/components/callout";
import { MdxCard } from "@/components/mdx-card";

const components = {
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
  const Component = useMDXComponent(code);

  return (
    <div className="prose max-w-none dark:prose-invert">
      <Component components={components} />
    </div>
  );
}
