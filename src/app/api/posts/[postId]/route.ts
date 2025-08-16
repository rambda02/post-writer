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

export async function DELETE(
  req: NextRequest,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // parseAsyncは非同期で動作する
    // context.paramsがPromiseであることを検証
    // そのPromiseが解決されるのを待機
    // 解決された値が{ postId: string }の形式であることを検証
    const { params } = await routeContextSchema.parseAsync(context);
    const { postId } = await params;

    if (!(await verifyCurrentUserHasAccessToPost(postId))) {
      return NextResponse.json(null, { status: 403 });
    }

    await db.post.delete({
      where: {
        id: postId,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    } else {
      return NextResponse.json(null, { status: 500 });
    }
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
