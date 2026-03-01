// import "server-only";
// import { neon as postgres } from "@neondatabase/serverless"; // bun add drizzle-orm @neondatabase/serverless dotenv
// import { drizzle } from "drizzle-orm/neon-http";

// import { drizzle } from "drizzle-orm/node-postgres";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";
import * as schema from "./schema";
import assert from "node:assert";
// console.log(
//   `src/api/db/index.ts::process.env.DATABASE_URL: ${process.env.DATABASE_URL}`,
// );
assert(process.env.DATABASE_URL, "DATABASE_URL 未设置");

// const client = postgres(process.env.DATABASE_URL, {
//   max: 10, // 最大连接数
// });
// export const db = drizzle(client, { schema });

// 🟢 防止开发模式下重复创建客户端
declare global {
  var __db_client__: ReturnType<typeof postgres> | undefined;
  var __db__: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

// 如果已经存在全局实例就复用，否则创建新的
const client =
  global.__db_client__ ??
  postgres(process.env.DATABASE_URL, {
    max: 10,
  });

const db = global.__db__ ?? drizzle({ client, schema });

// 开发模式下挂到全局，防止 Fast Refresh 重新创建
if (process.env.NODE_ENV === "development") {
  global.__db_client__ = client;
  global.__db__ = db;
}

export { db, client };

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type Db = typeof db | Tx;
