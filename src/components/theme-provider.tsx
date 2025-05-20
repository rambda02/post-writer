"use client";

// Reactのコアパッケージ
import { ComponentProps } from "react";

// アプリでダークモードやカラーテーマの切り替えを簡単に実装できるパッケージ
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
