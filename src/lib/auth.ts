import { NextAuthOptions } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { resend } from "@/lib/resend";

// テスト用メールアドレスかどうかを判定する関数
function isTestEmail(email: string): boolean {
  // dev + 数字@localhost.comのパターンのみをテスト用と判定
  const testPattern = /^(dev\d+)@(localhost)\.com$/i;
  return testPattern.test(email);
}

// Mailpitを使用してメールを送信する関数
async function sendViaMailpit(options: {
  from: string;
  to: string;
  subject: string;
  html: string;
}) {
  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host: process.env.MAILPIT_HOST || "localhost",
    port: parseInt(process.env.MAILPIT_SMTP_PORT || "1025"),
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transport.sendMail({
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}

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

    // Email 認証プロバイダーの設定
    EmailProvider({
      // メールの送信元を設定
      from: process.env.SMTP_FROM,

      // メールの送信処理
      sendVerificationRequest: async ({ identifier, url }) => {
        try {
          const fromEmail =
            process.env.SMTP_FROM || "Rambda <noreply@example.com>";

          // テスト用メールアドレスかどうかを判定
          const isTestMail = isTestEmail(identifier);

          // 開発環境 + テストメールアドレス + Mailpit有効の場合はMailpitを使用
          if (
            process.env.NODE_ENV === "development" &&
            isTestMail &&
            process.env.MAILPIT_ENABLED !== "false"
          ) {
            // Mailpitを使用してメールを送信
            await sendViaMailpit({
              from: fromEmail,
              to: identifier,
              subject: "Verify your email address",
              html: `<p>Click <a href="${url}">here</a> to verify your email address</p>`,
            });

            return;
          }

          await resend.emails.send({
            from: fromEmail,
            to: identifier,
            subject: "Verify your email address",
            html: `<p>Click <a href="${url}">here</a> to verify your email address</p>`,
          });
        } catch (error) {
          // 開発環境の場合はエラーを表示
          if (process.env.NODE_ENV === "development") {
            console.error("メール送信エラー:", error);
          }

          // エラーをスロー
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],

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
