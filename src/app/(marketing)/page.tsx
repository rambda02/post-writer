import { HeroSection } from "@/components/marketing/hero-section"; // Hero セクションコンポーネント (Hero セクションの表示を行う)
import { FeaturesSection } from "@/components/marketing/features-section"; // Features セクションコンポーネント (Features セクションの表示を行う)
import { OpenSourceSection } from "@/components/marketing/open-source-section"; // Open Source セクションコンポーネント (Open Source セクションの表示を行う)

/**
 * GitHub リポジトリのスター数を取得する
 * @returns スター数 (string) |　null
 */
async function getGitHubStars(): Promise<string | null> {
  try {
    // GitHub　リポジトリ情報を取得する
    const response = await fetch(
      "https://api.github.com/repos/rambda555/post-writer",
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
        next: {
          revalidate: 60, // 60秒ごとに更新
        },
      }
    );

    // レスポンスが成功しなかった場合は　null　を返す
    if (!response?.ok) {
      return null;
    }

    // レスポンスを　JSON　形式に変換する
    const json = await response.json();

    // スター数を整形して返す
    return parseInt(json["stargazers_count"]).toLocaleString();
  } catch (error) {
    // 開発環境ではコンソールにもエラーを表示
    if (process.env.NODE_ENV === "development") {
      console.error("GitHub Stars Error:", error);
    }

    return null;
  }
}

export default async function IndexPage() {
  // GitHub リポジトリのスター数を取得する
  const stars = await getGitHubStars();

  return (
    <div>
      {/* Header セクション */}
      <HeroSection />

      {/* Features セクション */}
      <FeaturesSection />

      {/* Open Source セクション */}
      <OpenSourceSection stars={stars} />
    </div>
  );
}
