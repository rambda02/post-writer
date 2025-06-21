import { Resend } from "resend"; // Resend のパッケージ (メール送信サービスを提供する)

// Resend のインスタンスを作成 (Resend の API キーを使用してメール送信サービスを提供する)
export const resend = new Resend(process.env.RESEND_API_KEY);
