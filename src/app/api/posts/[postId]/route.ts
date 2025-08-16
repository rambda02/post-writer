import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { postPatchSchema } from "@/lib/validations/post";

const routeContextSchema = z.object({
  params: z.promise(
    z.object({
      postId: z.string(),
    })
  ),
});

/**
 * 投稿を削除する
 *
 * @param req - リクエスト
 * @param context - コンテキスト
 *
 * @returns - 204 成功
 *            403 認証エラー
 *            500 サーバーエラー
 */
export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // パラメーターを取得する
    const { params } = await routeContextSchema.parseAsync(context);
    const { postId } = await params;

    // ユーザーの投稿が存在しない場合
    if (!(await verifyCurrentUserHasAccessToPost(postId))) {
      // 403 エラーを返す
      return new Response(null, { status: 403 });
    }

    // 投稿を削除する
    await db.post.delete({
      where: {
        id: postId,
      },
    });

    // 204 成功を返す
    return new Response(null, { status: 204 });
  } catch (error) {
    // バリデーションエラーの場合
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    // サーバーエラーの場合
    // 500 エラーを返す
    return new Response(null, { status: 500 });
  }
}

/**
 * 投稿を更新する
 *
 * @param req - リクエスト
 * @param context - コンテキスト
 *
 * @returns - 200 成功
 *            403 認証エラー
 *            500 サーバーエラー
 */
export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // 投稿 ID を取得する
    const { params } = await routeContextSchema.parseAsync(context);
    const { postId } = await params;

    // ユーザーが投稿にアクセスできない場合
    if (!(await verifyCurrentUserHasAccessToPost(postId))) {
      // 403 エラーを返す
      return new Response(null, { status: 403 });
    }

    // リクエストボディを取得する
    const json = await req.json();
    const body = postPatchSchema.parse(json);

    // 投稿を更新する
    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    // 200 成功を返す
    return new Response(null, { status: 200 });
  } catch (error) {
    // バリデーションエラーの場合
    if (error instanceof z.ZodError) {
      // 422 エラーを返す
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    // サーバーエラーの場合
    // 500 エラーを返す
    return new Response(null, { status: 500 });
  }
}

/**
 * ユーザーが投稿にアクセスできるかどうかを確認する
 *
 * @param postId - 投稿の ID
 *
 * @returns - true: ユーザーが投稿にアクセスできる
 *           false: ユーザーが投稿にアクセスできない
 */
async function verifyCurrentUserHasAccessToPost(
  postId: string
): Promise<boolean> {
  // セッションを取得する
  const session = await getServerSession(authOptions);

  // 投稿を取得する
  const count = await db.post.count({
    where: {
      id: postId,
      authorId: session?.user.id,
    },
  });

  return count > 0;
}
