/* ファイルのパスを取得するためのモジュール */
import { dirname } from "path";

/* URL オブジェクトを操作するためのモジュール */
import { fileURLToPath } from "url";

/* ESLint 設定を互換モードで読み込むためのモジュール */
import { FlatCompat } from "@eslint/eslintrc";

/**
 * 現在のファイルのパスを取得する
 */
// import.meta.url: 現在のファイルの URL を取得するためのプロパティ (例: file:///Users/user/Desktop/next-blog/eslint.config.mjs)
// fileURLToPath: URL をファイルパスに変換する関数 (例：　/Users/user/Desktop/next-blog/eslint.config.mjs)
const __filename = fileURLToPath(import.meta.url);

/**
 * 現在のファイルのディレクトリ名を取得する
 */
// dirname: ファイルのディレクトリ名を取得するための関数 (例: /Users/user/Desktop/next-blog)
const __dirname = dirname(__filename);

/**
 * ESLint の設定を互換性のある方法で管理するためのクラスをインスタンス化する
 */
// FlatCompat: ESLint の設定を互換性のある方法で管理するためのクラス
// ESLint v9で導入された新しいフラット設定形式と、ESLint v8以前で使用されていた従来の設定形式（.eslintrcなど）との間の橋渡しをする重要なクラス
const compat = new FlatCompat({
  // 設定ファイルの基準となるディレクトリを現在のファイルのディレクトリに設定
  // 依存関係の解決: どのディレクトリのnode_modulesから検索を開始すべきかを知るために基準ディレクトリが必要
  // 拡張設定のパス解決: extendsで指定された設定（"next/core-web-vitals"など）の正確な場所を特定するために、起点となるディレクトリが必要
  // 一貫性の確保: プロジェクト内のどこからESLint設定が読み込まれても、同じ基準点を持つことで一貫した動作を保証
  baseDirectory: __dirname,
});

/**
 * 拡張設定を読み込む
 */
const eslintConfig = [
  // next/core-web-vitals: Next.js のコアバッドプラクティスをチェックするためのルール
  // next/typescript: TypeScript のコードをチェックするためのルール
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
