import NextAuth from "next-auth"; // NextAuth.js のコアパッケージ

import { authOptions } from "@/lib/auth"; // NextAuth.js の設定

// NextAuth.js のハンドラーを作成する
const handler = NextAuth(authOptions);

// GET と POST リクエストに対するハンドラーを指定する
export { handler as GET, handler as POST };
