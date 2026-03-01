'use server'

import { db } from '@/lib/db'
import { checkMemberPermission } from './member'

import { eq, and, sql, getTableColumns } from 'drizzle-orm'
import type {
  AddVersionFile,
  CreateVersion,
  FileOperations,
  UpdateVersion,
} from '../types/version'
// import { mutPrepareVersionFiles } from "@/lib/services/project/version.tool";
import { AppErr } from '@/lib/http/types'
import { version, versionFile } from '@/lib/db/schema'
import { file } from '@/modules/upload/schema/file'
import { withAuth } from '@/lib/func/auth'

// C

// 1. insert project_version, status.default = 'uploading'
// 2. 准备 versionFile[] 用于一次性插入
// 3. 一次性插入 versionFile[]
// 4. 生成 uploadUrl[]
// export type AA = string
export const createVersion = withAuth(
  async (authId, { files, ...data }: CreateVersion) => {
    const hasPermission = await checkMemberPermission(
      data.projectId,
      authId,
      'version:create',
    )
    if (!hasPermission) throw AppErr('无权限操作此项目', 403)
    return await db.transaction(async tx => {
      // 1. insert project_version
      const [newVersion] = await tx
        .insert(version)
        .values({
          ...data,
          publisherId: authId,
        })
        .returning({ id: version.id })

      // await tx.insert(versionFile).values(files);
      const fileRecords = await Promise.all(
        files.map(async fileRecord => {
          await tx
            .update(file)
            .set({ status: 'success' })
            .where(eq(file.id, fileRecord.fileId))
          return { ...fileRecord, versionId: newVersion.id }
        }),
      )
      await tx.insert(versionFile).values(fileRecords)

      // // 2. 准备 versionFile[]
      // const fileRecords = mutPrepareVersionFiles(versionFiles, projectId, newVersion.id);
      // // 3. 一次性插入 versionFile[]
      // // 4. 生成 uploadUrl[]
      // const signedUrls = await generateUploadUrls(fileRecords);

      // 5. 可选, 修改项目类型
      // if (type === "community") {
      //   const type = inferProjectType(fileRecords, reqVersion.loaders);
      //   await tx.update(project).set({ type }).where(eq(project.id, projectId));
      // }

      return true
    })
  },
)

export async function listVersionWithFiles(projectId: string) {
  return await db.query.version.findMany({
    where: eq(version.projectId, projectId),
    with: {
      versionFiles: {
        with: {
          file: true,
        },
      },
    },
    orderBy: (version, { desc }) => [desc(version.createdAt)],
  })
  // const versionLs = await db
  //   .select()
  //   .from(version)
  //   .where(eq(version.projectId, projectId));
  // const versionFilesLs = await db
  //   .select({
  //     ...getTableColumns(versionFile),
  //     file: getTableColumns(file),
  //   })
  //   .from(versionFile)
  //   .where(eq(versionFile.versionId, version.id))
  //   .innerJoin(file, eq(file.id, versionFile.fileId));
  // return versionLs.map((version) => {
  //   const versionFiles = versionFilesLs.filter(
  //     (versionFile) => versionFile.versionId === version.id,
  //   );
  //   return {
  //     ...version,
  //     versionFiles,
  //   };
  // });
}
export type VersionWithFiles = Awaited<ReturnType<typeof listVersionWithFiles>>[number]

// U
// export const updateVersion = withAuth(
//   async (
//     authId,
//     {
//       projectId,
//       versionId,
//       versionUpdateData,
//       fileOperations,
//     }: {
//       projectId: string;
//       versionId: string;
//       versionUpdateData: UpdateVersion;
//       fileOperations: FileOperations;
//     },
//   ) => {
//     const hasPermission = await checkMemberPermission(projectId, authId, "version.write");
//     if (!hasPermission) throw AppErr("无权限操作此项目", 403);

//     return await db.transaction(async (tx) => {
//       // 1. 更新版本基本信息
//       if (Object.keys(versionUpdateData).length > 0) {
//         await tx
//           .update(projectVersion)
//           .set(versionUpdateData)
//           .where(eq(projectVersion.id, versionId));
//       }

//       // 2. 处理文件操作
//       if (fileOperations) {
//         // 2.1 删除文件
//         if (fileOperations.delete && fileOperations.delete.length > 0) {
//           // 验证文件是否属于此版本 (避免误删除其他版本的文件)
//           const filesToDelete = await tx
//             .select({
//               id: versionFile.id,
//               storageKey: versionFile.storageKey,
//             })
//             .from(versionFile)
//             .where(
//               and(
//                 eq(versionFile.versionId, versionId),
//                 // 使用 SQL 的 IN 操作符
//                 sql`${versionFile.id} = ANY(${fileOperations.delete})`,
//               ),
//             );

//           if (filesToDelete.length > 0) {
//             // 删除数据库记录
//             await tx
//               .delete(versionFile)
//               .where(
//                 and(
//                   eq(versionFile.versionId, versionId),
//                   sql`${versionFile.id} = ANY(${fileOperations.delete})`,
//                 ),
//               );

//             // TODO: 删除存储文件（可以异步处理或加入删除队列）
//             // for (const file of filesToDelete) {
//             //   await deleteStorageFile(file.storageKey);
//             // }
//           }
//         }

//         // 2.2 更新文件信息
//         if (fileOperations.update && fileOperations.update.length > 0) {
//           for (const fileUpdate of fileOperations.update) {
//             const { id, ...updateFields } = fileUpdate;

//             // 验证文件是否属于此版本
//             const existingFile = await tx
//               .select({ id: versionFile.id })
//               .from(versionFile)
//               .where(and(eq(versionFile.id, id), eq(versionFile.versionId, versionId)))
//               .limit(1);

//             if (existingFile.length === 0) {
//               throw new Error(`文件 ${id} 不存在或不属于此版本`);
//             }
//             await tx.update(versionFile).set(updateFields).where(eq(versionFile.id, id));
//           }
//         }

//         // 2.3 新增文件
//         if (fileOperations.add && fileOperations.add.length > 0) {
//           const fileRecords = mutPrepareVersionFiles(
//             fileOperations.add,
//             projectId,
//             versionId,
//           );

//           // 批量插入新文件记录
//           await tx.insert(versionFile).values(fileRecords);

//           // 4. 生成 uploadUrl[]
//           return await generateUploadUrls(fileRecords);
//         }
//       }
//     });
//   },
// );
