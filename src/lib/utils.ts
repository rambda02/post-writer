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

/**
 * 日付を Month Day, Year の形式でフォーマットする
 *
 * @param date 日付
 *
 * @returns フォーマットされた日付
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
