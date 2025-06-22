import { NextResponse } from "next/server"; // Next.js のサーバーサイド API を提供するパッケージ
import { db } from "@/lib/db"; // Prisma クライアント (Prisma を使用してデータベースに接続)

export async function GET(request: Request) {
  // 本番環境の場合
  if (process.env.VERCEL_ENV === "production") {
    // 認証ヘッダーを取得する
    const authHeader = request.headers.get("authorization");

    // 認証ヘッダーが CRON_SECRET と一致しない場合
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // 認証エラーを返す
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    // 現在の日時を取得する
    const now = new Date();

    // 有効期限切れのトークンを削除する
    const result = await db.verificationToken.deleteMany({
      where: { expires: { lt: now } },
    });

    // 削除したトークンの数をログに出力する
    console.log(`Cleaned up ${result.count} expired tokens`);

    // レスポンスを返す
    return NextResponse.json({
      success: true, // 処理が成功したかどうか (true: 成功, false: 失敗)
      deletedCount: result.count, // 削除したトークンの数
      timestamp: now.toISOString(), // 現在の日時を ISO 形式で返す
    });
  } catch (error) {
    // エラーが発生した場合のログを出力する
    console.error("Token cleanup failed:", error);

    // 内部サーバーエラーを返す
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  } finally {
    // データベース接続を切断する
    await db.$disconnect();
  }
}

// 最大実行時間を10秒に設定する
export const maxDuration = 10;
