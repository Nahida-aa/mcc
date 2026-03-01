// src/lib/db/schema/columnsHelpers.ts
import { serial, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

export const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .notNull(),
  // deletedAt: timestamp("deleted_at"),
}

export const timestamps_with_deleted_at = {
  ...timestamps,
  deleted_at: timestamp(),
}

export const commonColumns = {
  name: varchar({ length: 255 }).notNull(),
  summary: varchar({ length: 2048 }), // 摘要
  ...timestamps,
}

// export const commonColumnsWithDeletedAt = {
// }

export const autoIncrementCommon = {
  id: serial().primaryKey().notNull(),
  ...commonColumns,
}

export const uuidCommon = {
  id: uuid().primaryKey().notNull().defaultRandom(),
  ...commonColumns,
}

export const autoIncrementWithTimestamps = {
  id: serial().primaryKey().notNull(),
  ...timestamps,
}

export const uuidWithTimestamps = {
  id: uuid().primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' })
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
}
export const textUuidWithTimestamps = {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' })
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
}

export const pgNanoid = () => text().primaryKey().$defaultFn(nanoid)
export const pgCreatedAt = () => timestamp('created_at', { mode: 'string' }).defaultNow()
export const pgUpdatedAt = () =>
  timestamp('updated_at', { mode: 'string' }).$onUpdate(() => new Date().toISOString())

export const nanoidWithTimestamps = {
  id: pgNanoid(), // `${nanoid()}`
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' })
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
}

// 选全部列, 使用官方助手: getTableColumns
// 用于 drizzle-orm 的 db.select() 助手
export const pickColumns = <
  TTable extends Record<string, any>,
  // TCols extends Partial<Record<keyof TTable, boolean>>,
  TCols extends Partial<Record<keyof TTable['_']['columns'], boolean>>,
  // TCols extends { [K in keyof TTable]?: boolean },
>(
  table: TTable,
  columns: TCols,
): {
  [K in keyof TTable as TCols[K] extends true ? K : never]: TTable[K]
} => {
  const result = {} as any
  for (const key in columns) {
    if (columns[key]) {
      result[key] = table[key]
    }
  }
  return result
}
