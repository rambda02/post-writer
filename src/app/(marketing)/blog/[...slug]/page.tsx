import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import { buttonVariants } from "@/components/ui/button";

import "@/styles/mdx.css";
import { siteConfig } from "@/config/site";
import { Params } from "@/types";
import { absoluteUrl, cn, formatDate } from "@/lib/utils";
import { getPostFromParams, getAuthorsFromPost } from "@/lib/contentlayer";
import { Icons } from "@/components/icons";
import { Mdx } from "@/components/mdx/mdx-components";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  // パラメーターから投稿を取得する
  const post = await getPostFromParams(params);

  // 投稿が存在しない場合
  if (!post) {
    // メタデータを空にする
    return {};
  }

  // OG 画像の URL を生成する
  const ogUrl = new URL(`${siteConfig.url}/api/og`);

  // クエリパラメーターを設定する
  ogUrl.searchParams.set("heading", post.title);
  ogUrl.searchParams.set("type", "Blog Post");
  ogUrl.searchParams.set("mode", "dark");

  return {
    title: post.title,
    description: post.description,
    authors: post.authors.map((author) => ({
      name: author,
    })),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: absoluteUrl(post.slug),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogUrl.toString()],
    },
  };
}

export async function generateStaticParams(): Promise<Params[]> {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  // パラメーターから投稿を取得する
  const post = await getPostFromParams(params);

  // 投稿が存在しない場合
  if (!post) {
    // 404 エラーを返す
    notFound();
  }

  // 著者を取得する
  const authors = getAuthorsFromPost(post);

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      {/* 投稿一覧へのリンク */}
      <Link
        href="/blog"
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          "absolute left-[-200px] top-14 hidden xl:inline-flex"
        )}
      >
        <Icons.chevronLeft />
        See all posts
      </Link>

      <div>
        {/* 投稿の日付 */}
        {post.date && (
          <time
            dateTime={post.date}
            className="block text-sm text-muted-foreground"
          >
            Published on {formatDate(post.date)}
          </time>
        )}

        {/* タイトル */}
        <h1 className="mt-2 inline-block font-heading text-4xl leading-tighter lg:text-5xl">
          {post.title}
        </h1>

        {/* 著者 */}
        {authors?.length ? (
          <div className="mt-4 flex space-x-4">
            {authors.map((author) =>
              author ? (
                <Link
                  key={author._id}
                  href={`https://twitter.com/${author.twitter}`}
                  className="flex items-center space-x-2 text-sm"
                >
                  <Image
                    src={author.avatar}
                    alt={author.title}
                    width={42}
                    height={42}
                    className="rounded-full bg-white"
                  />
                  <div className="flex-1 text-left leading-tight">
                    <p className="font-medium">{author.title}</p>
                    <p className="text-[12px] text-muted-foreground">
                      @{author.twitter}
                    </p>
                  </div>
                </Link>
              ) : null
            )}
          </div>
        ) : null}
      </div>

      {/* 画像 */}
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={720}
          height={405}
          className="my-8 rounded-md border bg-muted transition-colors"
          priority
        />
      )}

      {/* 内容 */}
      <Mdx code={post.body.code} />

      {/* 区切り線 */}
      <hr className="mt-12" />

      {/* 投稿一覧へのリンク */}
      <div className="flex justify-center py-6 lg:py-10">
        <Link
          href="/blog"
          className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          See all posts
        </Link>
      </div>
    </article>
  );
}
