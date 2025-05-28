import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachePrisma: PrismaClient; // Prisma クライアント型のグローバル変数を宣言 (サーバーにキャッシュするため)
}

// Prisma クライアントを宣言
let prisma: PrismaClient; // Prisma クライアント型の変数を宣言

// 本番環境の場合は新しい Prisma クライアントを作成　 
// 開発環境ではホットリロードで不要なインスタンスが作成されてしまうため、
// サーバーキャッシュを使用することでメモリの使用を最適化を行う
if (process.env.NODE_ENV === "production") {
  // Prisma クライアントを作成
  prisma = new PrismaClient();

  // それ以外の環境の場合
} else {
  // サーバーキャッシュがない場合
  if (!global.cachePrisma) {
    // サーバーキャッシュを作成
    global.cachePrisma = new PrismaClient();
  }

  // サーバーキャッシュがある場合はサーバーキャッシュを使用
  prisma = global.cachePrisma;
}

// Prisma クライアントをエクスポートする
export const db = prisma;
