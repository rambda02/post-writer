import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachePrisma: PrismaClient;
}

let prisma: PrismaClient;

// 本番環境の場合
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();

  // それ以外の環境の場合
} else {
  // サーバーキャッシュがない場合
  if (!global.cachePrisma) {
    global.cachePrisma = new PrismaClient();
  }
  prisma = global.cachePrisma;
}

export const db = prisma;
