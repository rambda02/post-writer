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
    container: {
      center: true, // style: margin-inline: auto; tailwind: mx-auto
      padding: "2rem", // style: padding-inline: 2rem; tailwind: px-4
      screens: {
        "2xl": "1400px", // style: max-width: 1400px; tailwind: max-w-7xl
      },
    },
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
