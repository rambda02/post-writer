import { siteConfig } from "@/config/site";

/**
 * GitHub リポジトリのスター数を取得する
 * 
 * @returns スター数 | null
 */
export async function getGitHubStars(): Promise<string | null> {
  try {
    // GitHub　リポジトリ情報を取得する
    const response = await fetch(siteConfig.github.apiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
      next: {
        revalidate: 60, // 60秒ごとに更新
      },
    });

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
