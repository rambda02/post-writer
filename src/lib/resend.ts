import { Resend } from "resend";

// Resend のインスタンスを作成する
export const resend = new Resend(process.env.RESEND_API_KEY);
