import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * クラス名を結合して、Tailwind CSSのクラスを生成する
 *
 * @param inputs クラス名の配列
 *
 * @returns 結合されたクラス名
 */
export function cn(...inputs: ClassValue[]): string {
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

/**
 * 絶対 URL を生成する
 *
 * @param path パス
 *
 * @returns 絶対 URL
 */
export function absoluteUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}
