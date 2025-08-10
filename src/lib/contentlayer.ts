import {
  allAuthors,
  allPosts,
  allGuides,
  allPages,
  type Author,
  type Post,
  type Guide,
  type Page,
} from "contentlayer/generated";

import { Params } from "@/types";

/**
 * パラメーターから著者を取得する
 *
 * @param post 投稿
 *
 * @returns 著者
 */
export function getAuthorsFromPost(post: Post): (Author | undefined)[] {
  return post.authors.map((authorSlug) => {
    const author = allAuthors.find(
      ({ slug }) => slug === `/authors/${authorSlug}`
    );

    return author;
  });
}

/**
 * パラメーターから投稿を取得する
 *
 * @param params パラメーター
 *
 * @returns 投稿 | null
 */
export async function getPostFromParams(
  params: Promise<Params>
): Promise<Post | null> {
  const slug = (await params).slug.join("/");

  return allPosts.find((post) => post.slugAsParams === slug) ?? null;
}

/**
 * パラメーターからガイドを取得する
 *
 * @param params パラメーター
 *
 * @returns ガイド | null
 */
export async function getGuideFromParams(
  params: Promise<Params>
): Promise<Guide | null> {
  const slug = (await params).slug.join("/");

  return allGuides.find((guide) => guide.slugAsParams === slug) ?? null;
}

/**
 * パラメーターからページを取得する
 *
 * @param params パラメーター
 *
 * @returns ページ | null
 */
export async function getPageFromParams(
  params: Promise<Params>
): Promise<Page | null> {
  const slug = (await params).slug.join("/");

  return allPages.find((page) => page.slugAsParams === slug) ?? null;
}
