import {
  boolean,
  decimal,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { nanoidWithTimestamps } from "@/lib/db/helpers";
import { user } from "@/modules/auth/schema/tables";
import { payMethods, plans } from "@/modules/payment/schema/constants";

// product, 商品 good
// export const product = pgTable("product", {
//   ...uuidWithTimestamps,
//   name: text("name").notNull(), // 'iPhone 16'
//   price: decimal("price", { precision: 12, scale: 0 }).notNull(), // 单位分
//   description: text("description"),
// });

// 订单
export const order = pgTable("order", {
  ...nanoidWithTimestamps,
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  subscriptionId: text("subscription_id").references(() => subscription.id), // NULL = 商品订单
  orderNo: text("order_no").unique().notNull().$defaultFn(nanoid), // 对应 Ping++： order_no， alipay: out_trade_no, wxpay: out_trade_no
  amount: text("amount").notNull(), //
  status: text("status").notNull().default("pending"), // pending, paid, canceled, refunded, etc.
  payMethod: text("pay_method", { enum: payMethods }).notNull(), // alipay, wxpay, 银联, pingxx_alipay, pingxx_wxpay, etc.
  title: text("title").notNull(),
  description: text("description"),
  type: text("type", { enum: ["product", "subscription", "recurring"] })
    .notNull()
    .default("product"),
});

// 订阅\会员
export const subscription = pgTable("subscription", {
  ...nanoidWithTimestamps,
  plan: text("plan", { enum: plans }).notNull(), // plus
  referenceId: text("reference_id").notNull(), // 默认为 user_id
  status: text("status", { enum: ["pending", "active", "canceled"] })
    .notNull()
    .default("pending"), // active, canceled, etc.
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(true), // 到期后是否自动取消
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
});
