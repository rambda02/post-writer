import type { SentMessageInfo } from "nodemailer";

/**
 * テスト用メールアドレスか判定する
 *
 * @param email - メールアドレス
 *
 * @returns  true: テスト用メールアドレスの場合
 *          false: テスト用メールアドレスではない場合
 */
export function isTestEmail(email: string): boolean {
  // テスト用メールアドレスのパターンの正規表現
  // (例: dev1@localhost.com, dev2@localhost.com, ...)
  const testPattern = /^(dev\d+)@(localhost)\.com$/i;

  // 正規表現にマッチするか判定する
  return testPattern.test(email);
}

/**
 * テストメールを送信する
 *
 * @param options         - メール送信オプション
 * @param options.from    - メール送信元
 * @param options.to      - メール送信先
 * @param options.subject - メールの件名
 * @param options.html    - メールの本文
 *
 * @returns メール送信結果の詳細情報
 */
export async function sendTestEmail(options: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<SentMessageInfo> {
  const nodemailer = await import("nodemailer");

  // メール送信設定
  const transport = nodemailer.createTransport({
    host: process.env.MAILPIT_HOST || "localhost",
    port: parseInt(process.env.MAILPIT_PORT || "1025"),
    secure: false, // TLS/SSL 暗号化を無効化
    tls: {
      rejectUnauthorized: false, // 証明書の検証を無効化
    },
  });

  // メールを送信する
  return transport.sendMail({
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
