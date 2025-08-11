import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { db } from "@/lib/db";
import { isTestEmail, sendTestEmail } from "@/lib/mail";
import { resend } from "@/lib/resend";

// メールの送信元
const emailFrom = process.env.SMTP_FROM || "Post Writer <noreply@example.com>";

/**
 * NextAuth の設定オプション
 *
 * @type {NextAuthOptions} NextAuth の設定オプションオブジェクト
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    EmailProvider({
      from: emailFrom,

      sendVerificationRequest: async ({ identifier, url }) => {
        try {
          // 開発環境 + テスト用メールアドレスの場合
          if (
            process.env.NODE_ENV === "development" &&
            isTestEmail(identifier)
          ) {
            await sendTestEmail({
              from: emailFrom,
              to: identifier,
              subject: "Verify your email address",
              html: `<p>Click <a href="${url}">here</a> to verify your email address</p>`,
            });

            return;
          }

          // メールを送信する
          await resend.emails.send({
            from: emailFrom,
            to: identifier,
            subject: "Verify your email address",
            html: `<p>Click <a href="${url}">here</a> to verify your email address</p>`,
          });
        } catch (error) {
          // 開発環境の場合
          if (process.env.NODE_ENV === "development") {
            console.error("Failed to send verification email:", error);
          }

          // 例外をスローする
          throw new Error("Failed to send verification email");
        }
      },
    }),

    // GitHub 認証プロバイダー
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // 同じメールアドレスを持つ異なる認証プロバイダーのログインを許可する設定
    }),

    // Google 認証プロバイダー
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // 同じメールアドレスを持つ異なる認証プロバイダーのログインを許可する設定
    }),
  ],

  callbacks: {
    // JWT トークンを生成する (認証時、トークン更新時に呼ばれる)
    async jwt({ token, user }) {
      // ユーザーが存在する場合
      if (user) {
        // ユーザーの ID を JWT に追加する
        return { ...token, id: user.id };
      }

      // ブラウザの Cookie に保存する JWT トークンを返す
      return token;
    },

    // セッション情報を生成する (セッション取得時に呼ばれる)
    async session({ token, session }) {
      // トークンが存在する場合は、セッション情報に追加する
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      // セッション情報を返す
      return session;
    },
  },
};
