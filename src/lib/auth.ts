import { NextAuthOptions } from "next-auth"; // NextAuth.js のコアパッケージ
import Github from "next-auth/providers/github"; // GitHub を使用した認証を提供するパッケージ
import Google from "next-auth/providers/google"; // Google を使用した認証を提供するパッケージ
import { PrismaAdapter } from "@auth/prisma-adapter"; // Prisma のアダプター (Prisma を NextAuth.js と連携させるためのパッケージ)
import { db } from "./db"; // Prisma クライアント (Prisma を使用してデータベースに接続)

export const authOptions: NextAuthOptions = {
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
  ],
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, id: user.id };
      }

      return token;
    },

    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
