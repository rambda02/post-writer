import Stripe from "stripe";

// 環境変数が設定されていない場合はエラーを投げる
if (!process.env.STRIPE_API_KEY) {
  throw new Error("STRIPE_API_KEY is not set in environment variables");
}

// Stripe設定を型アサーションを使用して定義
export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2025-07-30.basil",
  typescript: true,
} as Stripe.StripeConfig);
