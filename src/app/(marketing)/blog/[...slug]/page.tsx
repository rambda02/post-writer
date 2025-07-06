import { Metadata } from "next"; // Next.js のコアパッケージ
import Link from "next/link"; // Next.js のリンクコンポーネント (リンクを表示する)
import Image from "next/image"; // Next.js の画像コンポーネント (画像を表示する)
import { notFound } from "next/navigation"; // Next.js のエラーハンドリングパッケージ (404 エラーを返す)
import "@/styles/mdx.css"; // MDX のスタイルシート
import { allAuthors, allPosts } from "contentlayer/generated"; // Contentlayer の型付きデータパッケージ （Markdown ファイルから生成されたデータを型付きで取得する）
import { absoluteUrl, cn, formatDate } from "@/lib/utils"; // ユーティリティ関数ライブラリ
import { buttonVariants } from "@/components/ui/button"; // ボタンコンポーネント (ボタンの表示を行う)
import { Mdx } from "@/components/mdx-components"; // MDX コンポーネント (Markdown を HTML に変換する)
import { siteConfig } from "@/config/site"; // サイトの設定
import { Icons } from "@/components/Icons"; // アイコンコンポーネント (アイコンの表示を行う)

// ダイナミックルーティングで受け取るパラメーターの型
interface PostPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

/**
 * パラメーターからブログ記事のデータを取得する関数
 * @param params パラメーター
 * @returns ブログ記事のデータ (Post) | null
 */
async function getPostFromParams({ params }: PostPageProps) {
  // パラメーターから slug を取得
  const slug = (await params).slug.join("/");

  // ブログ記事のデータを取得
  const post = allPosts.find((post) => post.slugAsParams === slug);

  // ブログ記事のデータが存在しない場合は null を返す
  if (!post) {
    return null;
  }

  return post;
}

/**
 * ブログ記事のメタデータを生成する関数
 * @param params パラメーター
 * @returns ブログ記事のメタデータ (Metadata) | {}
 */
export async function generateMetadata(
  params: PostPageProps
): Promise<Metadata> {
  // パラメーターからブログ記事のデータを取得
  const post = await getPostFromParams(params);

  // ブログ記事のデータが存在しない場合は空のオブジェクトを返す
  if (!post) {
    return {};
  }

  // Open Graph の URL を生成
  const ogUrl = new URL(`${siteConfig.url}/api/og`);

  // Open Graph の URL にパラメーターを設定
  ogUrl.searchParams.set("heading", post.title);
  ogUrl.searchParams.set("type", "Blog Post");
  ogUrl.searchParams.set("mode", "dark");

  return {
    title: post.title, // タイトル
    description: post.description, // 説明
    // 著者
    authors: post.authors.map((author) => ({
      name: author,
    })),

    // Open Graphの設定 (SEO 対策、 SNS シェアのための設定)
    openGraph: {
      title: post.title, // タイトル
      description: post.description, // 説明
      type: "article", // ウェブサイトの設定
      url: absoluteUrl(post.slug), // サイトの URL
      // Open Graph 画像の設定
      images: [
        {
          url: ogUrl.toString(), // Open Graph 画像の URL
          width: 1200, // 画像の幅
          height: 630, // 画像の高さ
          alt: post.title, // 画像の代替テキスト
        },
      ],
      locale: "ja", // 言語の設定
      siteName: siteConfig.name, // サイトの名前
    },
    // Twitter の設定 (SEO 対策、 SNS シェアのための設定)
    twitter: {
      card: "summary_large_image", // カードの設定
      title: post.title, // タイトル
      description: post.description, // 説明
      images: [ogUrl.toString()], // 画像
      creator: "@rambda", // 作成者
    },
  };
}

/**
 * 動的ルーティングのページをビルド時に静的生成する
 * パラメーター (...slug) を Next.js に渡して、各ブログ記事を事前に静的生成する
 * @returns ブログ記事のパラメーター (PostPageProps["params"][])
 */
export async function generateStaticParams(): Promise<
  Awaited<PostPageProps["params"]>[]
> {
  return allPosts.map((post) => ({
    // すべてのブログ記事に対して、 slugAsParams プロパティを取得して、 / で分割した配列を返す
    // 例： 　{slug: ["blog", "first-post"]}
    slug: post.slugAsParams.split("/"),
  }));
}

export default async function PostPage(params: PostPageProps) {
  // パラメーターからブログ記事を取得する
  const post = await getPostFromParams(params);

  // ブログ記事が存在しない場合は 404 エラーを返す
  if (!post) {
    notFound();
  }

  // 著者のデータを取得する
  const authors = post.authors.map((author) =>
    allAuthors.find(({ slug }) => slug === `/authors/${author}`)
  );

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      {/* ブログ記事の一覧へのリンク */}
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
        {/* ブログ記事の日付 */}
        {post.date && (
          <time
            dateTime={post.date}
            className="block text-sm text-muted-foreground"
          >
            Published on {formatDate(post.date)}
          </time>
        )}

        {/* ブログ記事のタイトル */}
        <h1 className="mt-2 inline-block font-heading text-4xl leading-tighter lg:text-5xl">
          {post.title}
        </h1>

        {/* ブログ記事の著者 */}
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

      {/* ブログ記事の画像 */}
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

      {/* ブログ記事の内容 */}
      <Mdx code={post.body.code} />

      {/* ブログ記事の区切り線 */}
      <hr className="mt-12" />

      {/* ブログ記事の一覧へのリンク */}
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
