// tailwind CSS のデフォルトのテーマ設定を提供するパッケージ
// フォントファミリー、色、間隔、サイズなどのデフォルト値が含まれており、これらの値を拡張または上書きしてカスタマイズできる
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
    extend: {
      fontFamily: {
        // フォントの設定
        sans: ["var(--font-sans)", ...fontFamily.sans],
        heading: ["var(--font-heading)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
    },
  },
};

export default config;
