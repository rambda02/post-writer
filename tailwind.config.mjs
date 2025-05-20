// tailwind CSSのデフォルトのテーマ設定 （アプリケーション全体のデザインシステム）　を提供するパッケージ
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  // テーマを適用するファイルのパスを指定
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/ui/**/*.{ts,tsx}",
    "./src/content/**/*.{md,mdx}",
  ],
  // テーマの設定
  theme: {
    // テーマの拡張
    extend: {
      fontFamily: {
        // フォントの設定
        sans: ["var(--font-sans)", ...fontFamily.sans],
        heading: ["var(--font-heading)", ...fontFamily.sans],
      },
    },
  },
};

export default config;
