import Link from "next/link"; // Next.js のリンクコンポーネント (リンクを表示する)
import Image from "next/image"; // Next.js の画像コンポーネント (画像を表示する)
import { allPosts } from "contentlayer/generated"; // Contentlayer の型付きデータパッケージ （Markdown ファイルから生成されたデータを型付きで取得する）
import { compareDesc } from "date-fns"; // 日付操作ライブラリ (日付の解析、フォーマット、比較、加算・減算などの機能を提供する)
import { formatDate } from "@/lib/utils"; // ユーティリティ関数ライブラリ

// メタデータの設定
export const metadata = {
  // タイトルの設定
  title: "Blog",
};

export default function BlogPage() {
  // 投稿を取得する
  const posts = allPosts
    .filter((post) => post.published) // 公開されている投稿を取得する
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date)); // 降順の日付でソートする
    });

  return (
    <div className="w-full mx-auto px-8 max-w-4xl py-6 lg:py-10">
      {/* 見出し */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            A blog built using Contentlayer. Posts are written in MDX.
          </p>
        </div>
      </div>

      {/* 区切り線 */}
      <hr className="my-8" />

      {/* 投稿一覧 */}
      {posts?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {posts.map((post, index) => (
            <article
              key={post._id}
              className="group relative flex flex-col space-y-2"
            >
              {/* 画像 */}
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.title}
                  width={804}
                  height={452}
                  className="rounded-md border bg-muted transition-colors"
                  priority={index <= 1}
                />
              )}

              {/* タイトル */}
              <h2 className="text-2xl font-extrabold">{post.title}</h2>

              {/* 説明 */}
              {post.description && (
                <p className="text-muted-foreground">{post.description}</p>
              )}

              {/* 日付 */}
              {post.date && (
                <p className="text-sm text-muted-foreground">
                  {formatDate(post.date)}
                </p>
              )}

              {/* リンク */}
              <Link href={post.slug} className="absolute inset-0">
                <span className="sr-only">View Article</span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p>No posts published.</p>
      )}
    </div>
  );
}
