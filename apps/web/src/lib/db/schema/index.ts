export * from "@/modules/activity/schema/tables";
export * from "@/modules/auth/schema/tables";
export * from "@/modules/project/schema/tables";
export * from "@/modules/user/schema/tables";
export * from "../../../modules/notify/schema/tables";
export * from "../../../modules/payment/schema/tables";
export * from "../../../modules/community/schema/tables";
// export * from '@/modules/identity/schema/tables'
export * from "../../../modules/upload/schema/file";
export * from "./follow";
export * from "./friend";
export * from "./relations";
export * from "./team";

// 导出所有数据库schema, 用于 better-auth 集成
// 如果需要添加其他schema，在这里导出
// .notNull().default(`anon_${nanoid()}`)
