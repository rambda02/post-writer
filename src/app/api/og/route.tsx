import { ImageResponse } from "@vercel/og";

import { ogImageSchema } from "@/lib/validations/og";
import { OgImage } from "@/components/og/og-image";

// Edge ランタイム上で実行されることを指定
export const runtime = "edge";

const interRegular = fetch(
  new URL("../../../assets/fonts/Inter-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const interBold = fetch(
  new URL("../../../assets/fonts/CalSans-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

/**
 * Open Graph 画像を生成する
 *
 * @param req リクエスト
 *
 * @returns Open Graph 画像 | 500 エラー
 */
export async function GET(req: Request): Promise<ImageResponse | Response> {
  try {
    // フォントデータを取得する
    const fontRegular = await interRegular;
    const fontBold = await interBold;

    // クエリパラメーターを JavaScript オブジェクトに変換しバリデーションする
    const params = ogImageSchema.parse(
      Object.fromEntries(new URL(req.url).searchParams)
    );

    // ヘッディングの文字数をチェックし、140文字を超えていたら省略する
    const heading =
      params.heading.length > 140
        ? `${params.heading.substring(0, 140)}...`
        : params.heading;

    // 色を設定する
    const paint = params.mode === "dark" ? "#fff" : "#000";

    // フォントサイズを設定する
    const fontSize = heading.length > 100 ? "70px" : "100px";

    // 画像を生成する (バイナリデータを返す)
    return new ImageResponse(
      <OgImage
        heading={heading}
        type={params.type}
        mode={params.mode}
        paint={paint}
        fontSize={fontSize}
      />,
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
