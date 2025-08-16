import { freePlan, proPlan } from "@/config/subscriptions";
import { UserSubscriptionPlan } from "@/types";
import { db } from "@/lib/db";

/**
 * ユーザーのサブスクリプションプランを取得する
 *
 * @param userId - ユーザー ID
 *
 * @returns - ユーザーのサブスクリプションプラン情報
 */
export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  // ユーザー情報を取得する
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  // ユーザーが存在しない場合
  if (!user) {
    // エラーをスローする
    throw new Error("User not found");
  }

  // プロプラン判定フラグ
  const isPro = Boolean(
    user.stripePriceId &&
      user.stripeCurrentPeriodEnd &&
      user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );

  // プランを取得する
  const plan = isPro ? proPlan : freePlan;

  // ユーザーのサブスクリプションプラン情報を返す
  return {
    ...plan,
    stripeCustomerId: user.stripeCustomerId || "",
    stripeSubscriptionId: user.stripeSubscriptionId || "",
    stripePriceId: plan.stripePriceId,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd
      ? user.stripeCurrentPeriodEnd.getTime()
      : 0,
    isPro,
  };
}
