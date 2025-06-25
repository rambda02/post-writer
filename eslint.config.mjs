import { dirname } from "path"; // ファイルパスを操作するためのユーティリティ関数を提供する
import { fileURLToPath } from "url"; // UR の解析や操作に関するユーティリティを提供する
import { FlatCompat } from "@eslint/eslintrc"; // 古い ESLint 設定を新しいフラット設定に変換するためのモジュール

// 現在のファイルのパスを取得する
const __filename = fileURLToPath(import.meta.url);

// 現在のファイルのディレクトリ名を取得する
const __dirname = dirname(__filename);

// 古い ESLint 設定を新しいフラット設定に変換するためのインスタンスを作成する
const compat = new FlatCompat({
  baseDirectory: __dirname, // ライブラリや設定ファイルを探すための基準ディレクトリ
});

// 拡張設定を読み込む
const eslintConfig = [
  // next/core-web-vitals - パフォーマンスに関する問題 (ページの読み込み速度、インタラクティブ性) を検出するルールが含まれている
  // next/typescript - TypeScript コードに特化したルールで、型の不一致や潜在的なエラーを検出する
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
