import { ImageResponse } from "@vercel/og"; // Vercel の Open Graph 画像生成ライブラリ (HTML を生成して、それを画像に変換する)
import { ogImageSchema } from "@/lib/validations/og"; // バリデーションスキーマ (バリデーションを行うためのスキーマ)
import { siteConfig } from "@/config/site"; // サイトの設定
import { Icon } from "@/components/og/Icon"; // OGアイコンコンポーネント (OGアイコンの表示を行う)
import { Logo } from "@/components/og/Logo"; // OGロゴコンポーネント (OGロゴの表示を行う)

// Vercel の Edge ランタイム上で実行されることを指定
// この API ルートは通常の Node.js サーバーではなく、 Vercel のエッジランタイム上で実行される
// Vercel のエッジランタイムは簡単に言うと「世界中に分散配置された超高速な実行環境」
// エッジランタイムとはコンビニのように世界中に配置されている小さなサーバー
// 最寄りの「エッジ」からデータを提供するので高速に動作する
// リクエストが来ると、ユーザーに最も近いエッジロケーションで実行します
export const runtime = "edge";

// Inter-Regularフォントファイルを読み込む
const interRegular = fetch(
  // フォントファイルのパスを指定
  new URL("../../../assets/fonts/Inter-Regular.ttf", import.meta.url)
  // レスポンスボディ （フォントデータ） をバイナリデータとして扱える ArrayBuffer 形式に変換
).then((res) => res.arrayBuffer());

// CalSans-SemiBoldフォントファイルを読み込む
const interBold = fetch(
  // フォントファイルのパスを指定
  new URL("../../../assets/fonts/CalSans-SemiBold.ttf", import.meta.url)
  // レスポンスボディ（フォントデータ）をバイナリデータとして扱えるArrayBuffer形式に変換
).then((res) => res.arrayBuffer());

/**
 * Open Graph 画像を生成する API ルート
 * @param req Requestオブジェクト
 * @returns 生成された Open Graph 画像のバイナリデータ
 */
export async function GET(req: Request) {
  try {
    // フォントデータを取得する
    const fontRegular = await interRegular;
    const fontBold = await interBold;

    // リクエストのURLを解析する
    const url = new URL(req.url);

    // クエリパラメータを JavaScript オブジェクトに変換しバリデーションする
    const values = ogImageSchema.parse(Object.fromEntries(url.searchParams));

    // ヘッディングの文字数をチェックし、140文字を超えていたら省略する
    const heading =
      values.heading.length > 140 // ヘッディングの文字数が140文字を超えていたら
        ? `${values.heading.substring(0, 140)}...` // 140文字を超えていたら140文字までを取得し、末尾に...を追加
        : values.heading; // 140文字を超えていなかったらそのまま

    // モードを取得し、モードに応じて色を設定する
    const { mode } = values;
    const paint = mode === "dark" ? "#fff" : "#000";

    // フォントサイズを設定する
    const fontSize = heading.length > 100 ? "70px" : "100px";

    // 画像を生成する (バイナリデータを返す)
    return new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-12 w-full h-full items-start"
          style={{
            color: paint,
            background:
              mode === "dark"
                ? "linear-gradient(90deg, #000 0%, #111 100%)"
                : "white",
          }}
        >
          {/* Next.js ロゴ */}
          <Logo.nextjs paint={paint} />

          {/* ヘッディング */}
          <div tw="flex flex-col flex-1 py-10">
            <div
              tw="flex text-xl uppercase font-bold tracking-tight"
              style={{ fontFamily: "Inter", fontWeight: "normal" }}
            >
              {values.type}
            </div>
            <div
              tw="flex leading-[1.1] text-[80px] font-bold"
              style={{
                fontFamily: "Cal Sans",
                fontWeight: "bold",
                marginLeft: "-3px",
                fontSize,
              }}
            >
              {heading}
            </div>
          </div>

          <div tw="flex items-center w-full justify-between">
            {/* サイト名 */}
            <div
              tw="flex text-xl"
              style={{ fontFamily: "Inter", fontWeight: "normal" }}
            >
              {new URL(siteConfig.url).host}
            </div>

            {/* GitHubリポジトリ */}
            <div
              tw="flex items-center text-xl"
              style={{ fontFamily: "Inter", fontWeight: "normal" }}
            >
              <Icon.github paint={paint} />
              <div tw="flex ml-2">
                {new URL(siteConfig.links.github).host +
                  new URL(siteConfig.links.github).pathname}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        // 画像の幅と高さを設定
        width: 1200,
        height: 630,

        // フォントを設定
        fonts: [
          {
            name: "Inter",
            data: fontRegular,
            weight: 400,
            style: "normal",
          },
          {
            name: "Cal Sans",
            data: fontBold,
            weight: 700,
            style: "normal",
          },
        ],
      }
    );
  } catch (error) {
    // 開発環境ではコンソールエラーを表示
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    // エラーが発生した場合は500エラーを返す
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
