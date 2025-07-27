import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { db } from "@/lib/db";
import { isTestEmail, sendTestEmail } from "@/lib/mail";
import { resend } from "@/lib/resend";

const DEFAULT_EMAIL_FROM = "Post Writer <noreply@example.com>"; // メール送信元のデフォルト値

// メール送信元
const emailFrom = process.env.SMTP_FROM || DEFAULT_EMAIL_FROM;

/**
 * NextAuth の設定オプション
 *
 * @type {NextAuthOptions} NextAuth の設定オプションオブジェクト
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db), // Prisma のアダプターを使用してデータベースに接続
  session: { strategy: "jwt" }, // セッション管理に JWT を使用
  pages: { signIn: "/login" }, // ログインページの設定 (未認証時に保護されたページにアクセスしようとした場合にリダイレクトされるページ)

  // 認証プロバイダーの設定
  providers: [
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

    // Email 認証プロバイダー
    EmailProvider({
      // メールの送信元の設定
      from: emailFrom,

      // メールの送信処理の設定
      sendVerificationRequest: async ({ identifier, url }) => {
        try {
          // テスト用メールアドレス判定フラグ
          const isTestMail = isTestEmail(identifier);

          // 開発環境 + テスト用メールアドレスの場合
          if (process.env.NODE_ENV === "development" && isTestMail) {
            // テストメールを送信する
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
  ],

  // コールバックの設定 (認証後の処理)
  callbacks: {
    // JWT トークンを生成する
    async jwt({ token, user }) {
      // ユーザーが存在する場合
      if (user) {
        // ユーザーの ID を JWT に追加する
        return { ...token, id: user.id };
      }

      // ブラウザの Cookie に保存する JWT トークンを返す
      return token;
    },

    // セッション情報を生成する
    async session({ token, session }) {
      // トークンが存在する場合は、セッション情報に追加する
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      // クライアントサイドに返すセッション情報を返す
      return session;
    },
  },
};
