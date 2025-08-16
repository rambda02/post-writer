import { getServerSession } from "next-auth/next";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { RequiresProPlanError } from "@/lib/exceptions";
import { getUserSubscriptionPlan } from "@/lib/subscription";

const postCreateSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    const posts = await db.post.findMany({
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
      },
      where: {
        authorId: user.id,
      },
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    return new Response(null, { status: 500 });
  }
}

/**
 * 投稿を作成する
 *
 * @param req - リクエスト
 *
 * @returns - 200: 成功 (投稿を作成した結果を返す)
 *            402: プロプランが必要
 *            403: 認証エラー
 *            422: バリデーションエラー
 *            500: サーバーエラー
 */
export async function POST(req: Request): Promise<Response> {
  try {
    // セッションを取得する
    const session = await getServerSession(authOptions);

    // セッションが存在しない場合
    if (!session) {
      // 403 エラーを返す
      return new Response("Unauthorized", { status: 403 });
    }

    // ユーザーを取得する
    const { user } = session;

    // ユーザーのサブスクリプションプラン情報を取得する
    const subscriptionPlan = await getUserSubscriptionPlan(user.id);

    // ユーザーが無料プランの場合
    // ユーザーが投稿の制限に達したかどうかを確認する
    if (!subscriptionPlan?.isPro) {
      // ユーザーの投稿数を取得する
      const count = await db.post.count({
        where: {
          authorId: user.id,
        },
      });

      // ユーザーの投稿数が3件を超えていた場合
      if (count >= 3) {
        // プロプランが必要なエラーをスローする
        throw new RequiresProPlanError();
      }
    }

    // リクエストボディを取得する
    const json = await req.json();

    // リクエストボディをパースする
    const body = postCreateSchema.parse(json);

    // 投稿を作成する
    const post = await db.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    // 投稿を作成した結果を返す (200: 成功)
    return new Response(JSON.stringify(post));
  } catch (error) {
    // バリデーションエラーの場合
    if (error instanceof z.ZodError) {
      // 422 エラーを返す
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    // プロプランが必要なエラーの場合
    if (error instanceof RequiresProPlanError) {
      // 402 エラーを返す
      return new Response("Requires Pro Plan", { status: 402 });
    }

    // サーバーエラーの場合
    // 500 エラーを返す
    return new Response(null, { status: 500 });
  }
}
