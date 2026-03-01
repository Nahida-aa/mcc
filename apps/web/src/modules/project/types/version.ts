import { version, versionFile } from "@/lib/db/schema"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod/v4"

// version

export type SelectVersion = typeof version.$inferSelect
export const selectVersionZ = createSelectSchema(version)
export type SelectVersionZ = z.infer<typeof selectVersionZ>
export const versionUpdateSchema = createUpdateSchema(version)
export type UpdateVersion = z.infer<typeof versionUpdateSchema>
export const insertVersionZ = createInsertSchema(version)
// version file
export const _insertVersionFileZ = createInsertSchema(versionFile)
export type _InsertVersionFile = typeof versionFile.$inferInsert
export const updateVersionFileZ = createUpdateSchema(versionFile)
export type _UpdateVersionFile = z.infer<typeof updateVersionFileZ>

export const addVersionFileZ = _insertVersionFileZ.omit({
  id: true,
  versionId: true,
})
export type AddVersionFile = z.infer<typeof addVersionFileZ>

// c
export const createVersionZ = insertVersionZ
  .omit({
    id: true,
    downloads: true,
    createdAt: true,
    status: true,
    publisherId: true,
  })
  .extend({
    files: z.array(addVersionFileZ),
  })
export type CreateVersion = z.infer<typeof createVersionZ>

export const versionCreateWithFilesZ = createVersionZ.extend({
  versionFiles: z.array(addVersionFileZ),
})

export const fileOperationsSchema = z
  .object({
    // 新增文件
    add: z.array(addVersionFileZ).optional(),
    // 删除文件（通过fileId）
    delete: z.array(z.string()).optional(),
    // 更新文件信息（不包括文件本身）
    update: z
      .array(
        z.object({
          id: z.string().meta({ example: "file123" }),
          uploadStatus: z.enum(["pending", "uploaded", "failed"]).optional(),
        }),
      )
      .optional(),
  })
  .optional()
export type FileOperations = z.infer<typeof fileOperationsSchema>

export const versionUpdateZ = createUpdateSchema(version).omit({
  id: true,
  projectId: true,
  downloads: true,
  createdAt: true,
})
export type VersionUpdate = z.infer<typeof versionUpdateZ>

export const versionUpdateWithOperationsZ = createUpdateSchema(version)
  .omit({ id: true, projectId: true, downloads: true, createdAt: true })
  .extend({
    // 文件变更操作
    fileOperations: fileOperationsSchema,
  })

export const versionIdSchema = z.object({
  projectId: z.string(),
  id: z.string(),
})
