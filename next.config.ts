// Next.js フレームワークのコアパッケージ
import type { NextConfig } from "next";

// Contentlayer を使用して Next.js プロジェクトでコンテンツを管理するためのライブラリ
import { withContentlayer } from "next-contentlayer2";

// Next.js の設定を行う
// NextConfig - Next.js アプリケーションの設定を定義するためのインターフェース
// reactStrictMode - React の StrictMode を有効にするかどうか
// デフォルトでは true になっているが、開発環境では false にすることが多い
const nextConfig: NextConfig = { reactStrictMode: true };

// ContentLayer の機能を Next.js プロジェクトに統合する
// withContentlayer - Contentlayer の設定を行うための関数
export default withContentlayer(nextConfig);
