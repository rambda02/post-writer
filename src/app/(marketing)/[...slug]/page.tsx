import { Metadata } from "next";
import { notFound } from "next/navigation";
import { allPages } from "contentlayer/generated";

import "@/styles/mdx.css";
import { siteConfig } from "@/config/site";
import { Params } from "@/types";
import { absoluteUrl } from "@/lib/utils";
import { getContentFromParams } from "@/lib/contentlayer";
import { Mdx } from "@/components/mdx/mdx-components";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  // パラメーターからページを取得する
  const page = await getContentFromParams(params, "page");

  // ページが取得できない場合
  if (!page) {
    // メタデータを空にする
    return {};
  }

  // OG 画像の URL を生成する
  const ogUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/og`);

  // クエリパラメーターを設定する
  ogUrl.searchParams.set("heading", page.title);
  ogUrl.searchParams.set("type", siteConfig.name);
  ogUrl.searchParams.set("mode", "light");

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article",
      url: absoluteUrl(page.slug),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [ogUrl.toString()],
    },
  };
}

export async function generateStaticParams(): Promise<Params[]> {
  return allPages.map((page) => ({
    slug: page.slugAsParams.split("/"),
  }));
}

export default async function PagePage({
  params,
}: {
  params: Promise<Params>;
}) {
  // パラメーターからページを取得する
  const page = await getContentFromParams(params, "page");

  // ページが取得できない場合
  if (!page) {
    // 404 エラーを返す
    notFound();
  }

  return (
    <article className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-4">
        <h1 className="inline-block font-heading text-4xl lg:text-5xl">
          {page.title}
        </h1>
        {page.description && (
          <p className="text-xl text-muted-foreground">{page.description}</p>
        )}
      </div>
      <hr className="my-4" />
      <Mdx code={page.body.code} />
    </article>
  );
}
