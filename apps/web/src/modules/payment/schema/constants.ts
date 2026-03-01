// import { addMonths, addYears, endOfMonth } from "date-fns";

export const plans = [
  "creator_monthly", // 创作者会员
  "creator_yearly",
  "appreciator_monthly",
  "appreciator_yearly",
] as const;
export type Plan = (typeof plans)[number];

interface PlanInfo {
  amount: string;
  title: string;
  description?: string;
}
export const PlanInfoMap = {
  creator_monthly: {
    amount: "10",
    title: "创作者会员 (30天)",
  },
  creator_yearly: {
    amount: "100", // 10 * 12 * 0.8 = 96
    title: "创作者会员 (360天)",
  },
  appreciator_monthly: {
    amount: "20",
    title: "鉴赏家会员 (30天)",
  },
  appreciator_yearly: {
    amount: "200", // 20 * 12 * 0.8 = 192
    title: "鉴赏家会员 (360天)",
  },
};

export const payMethod = {
  alipay: {
    title: "支付宝",
    icon: "/pay/支付宝logo.png",
  },
  wechatpay: {
    title: "微信支付",
    icon: "/pay/wechatpay_600x600.png",
  },
};
export const payMethods = ["alipay", "wechatpay"] as const;
export type PayMethod = keyof typeof payMethod;
// export const genPlanInfo = (plan: Plan): PlanInfo => {};
// periodStart: new Date(),
// periodEnd: annual
//   ? endOfYear(addYears(new Date(), 1))  // 年付：当前 +1 年，月末（或 endOfYear 到 12-31）
//   : endOfMonth(addMonths(new Date(), 1)),  // 月付：当前 +1 月，月末（e.g., 2025-12-24 → 2026-01-31 正确！）
