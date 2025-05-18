/* Next.js フレームワークのコアパッケージ */
import type { NextConfig } from "next";

/* Contentlayer を使用してコンテンツを管理するためのライブラリ */
import { withContentlayer } from "next-contentlayer2";

/**
 * Next.js の設定
 */
// NextConfig: Next.js アプリケーションの設定インターフェース
// reactStrictMode: React の Strict Mode を有効にするかどうか
// デフォルトでは true になっているが、開発環境では false にすることが多い
const nextConfig: NextConfig = { reactStrictMode: true };

/**
 * withContentlayer 関数を使って Next.js の設定をラップすることで、
 * ContentLayer の機能を Next.js プロジェクトに統合する
 */
// withContentlayer: Contentlayer の設定を行うための関数
export default withContentlayer(nextConfig);
