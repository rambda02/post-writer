import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// クラス名のユーティリティ関数
export function cn(...inputs: ClassValue[]) {
  // クラス名を結合して、Tailwind CSSのクラスを生成する
  return twMerge(clsx(inputs));
}

// 日付をフォーマットする関数
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric", // 年
    month: "long", // 月
    day: "numeric", // 日
  });
}

// 絶対URLを生成する関数
export function absoluteUrl(path: string) {
  return `${process.env.NEXTAUTH_URL}${path}`; // サイトのURLとパスを結合して、絶対URLを生成する
}
