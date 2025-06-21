import { NextAuthOptions } from "next-auth"; // NextAuth.js のコアパッケージ
import Github from "next-auth/providers/github"; // GitHub を使用した認証を提供するパッケージ
import Google from "next-auth/providers/google"; // Google を使用した認証を提供するパッケージ
import { PrismaAdapter } from "@auth/prisma-adapter"; // Prisma のアダプター (Prisma を NextAuth.js と連携させるためのパッケージ)
import { db } from "./db"; // Prisma クライアント (Prisma を使用してデータベースに接続)

export const authOptions: NextAuthOptions = {
  // Prisma のアダプターを使用してデータベースに接続
  adapter: PrismaAdapter(db),

  // セッション管理に JWT を使用
  session: {
    strategy: "jwt",
  },

  // ログインページの設定 (未認証時に保護されたページにアクセスしようとした場合にリダイレクトされるページ)
  pages: {
    signIn: "/login",
  },

  // 認証プロバイダーの設定 (認証方法の設定)
  providers: [
    // GitHub 認証プロバイダーの設定
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // 同じメールアドレスを持つ異なる認証プロバイダーのログインを許可する設定
    }),

    // Google 認証プロバイダーの設定
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // 同じメールアドレスを持つ異なる認証プロバイダーのログインを許可する設定
    }),

  // コールバックの設定 (認証後の処理)
  callbacks: {
    // セッション情報の生成 (ブラウザの Cookie に保存されるセッション情報を生成)
    async session({ token, session }) {
      // トークンが存在する場合は、セッション情報に追加
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      // セッション情報を返す
      return session;
    },

    // JWT トークンの生成
    async jwt({ token, user }) {
      // ユーザーが存在する場合
      if (user) {
        // ユーザーの ID を JWT に追加
        return { ...token, id: user.id };
      }

      // トークンを返す
      return token;
    },
  },
};
