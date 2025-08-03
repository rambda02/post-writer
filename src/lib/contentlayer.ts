import {
  allGuides,
  allPages,
  type Guide,
  type Page,
} from "contentlayer/generated";

import { Params } from "@/types";

/**
 * パラメーターから Contentlayer のコンテンツを取得する
 *
 * @param params パラメーター
 *
 * @returns コンテンツ | null
 */
export async function getContentFromParams(
  params: Promise<Params>,
  type: "guide" | "page"
): Promise<Guide | Page | null> {
  const slug = (await params).slug.join("/");

  switch (type) {
    case "guide":
      return allGuides.find((guide) => guide.slugAsParams === slug) ?? null;
    case "page":
      return allPages.find((page) => page.slugAsParams === slug) ?? null;
    default:
      return null;
  }
}
