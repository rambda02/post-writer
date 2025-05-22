// Next.jsフレームワークのコアパッケージ
import type { NextConfig } from "next";

// Contentlayerを使用してNext.jsプロジェクトでコンテンツを管理するためのライブラリ
import { withContentlayer } from "next-contentlayer2";

// Next.jsの設定を行う
// NextConfig - Next.jsアプリケーションの設定を定義するためのインターフェース
// reactStrictMode - ReactのStrictModeを有効にするかどうか
// デフォルトではtrueになっているが、開発環境ではfalseにすることが多い
const nextConfig: NextConfig = { reactStrictMode: true };

// ContentLayerの機能をNext.jsプロジェクトに統合する
// withContentlayer - Contentlayerの設定を行うための関数
export default withContentlayer(nextConfig);
