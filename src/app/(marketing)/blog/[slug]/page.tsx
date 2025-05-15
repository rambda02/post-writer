import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Mdx } from "@/components/mdx-components";
import { siteConfig } from "@/config/site";

type PostPagePropsType = Promise<{
  slug: string;
}>;

async function getPostFromSlug(slug: string) {
  const post = allPosts.find((post) => post.slugAsParams === slug);

  if (!post) {
    return null;
  }

  return post;
}

export async function generateMetadata({
  params,
}: {
  params: PostPagePropsType;
}): Promise<Metadata> {
  const post = await getPostFromSlug((await params).slug);

  if (!post) {
    return {};
  }

  const url = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const ogUrl = new URL(`${url}/api/og`);
  ogUrl.searchParams.set("heading", post.title)
  ogUrl.searchParams.set("type", "Blog Post")
  ogUrl.searchParams.set("mode", "dark")

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      locale: "ja",
      url: siteConfig.url,
      title: post.title,
      description: post.description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [`${siteConfig.url}/og.png`],
      creator: "@Lambda878",
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: PostPagePropsType;
}) {
  const post = await getPostFromSlug((await params).slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-8 max-w-3xl py-6 lg:py-10">
      <div>
        {post.date && (
          <time>Published on {format(post.date, "yyyy/MM/dd")}</time>
        )}
        <h1 className="mt-2 font-extrabold text-4xl lg:text-5xl leading-tight">
          {post.title}
        </h1>
      </div>
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={720}
          height={405}
          className="my-8 border rounded-md bg-muted"
          priority={true}
        />
      )}
      <Mdx code={post.body.code} />
      <hr className="mt-12" />
      <div className="py-6 text-center lg:py-10">
        <Link
          href={"/blog"}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          全ての記事を見る
        </Link>
      </div>
    </article>
  );
}
