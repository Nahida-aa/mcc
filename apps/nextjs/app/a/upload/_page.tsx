// "use client";

// import { useState } from "react";
// import { Button } from "../../../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../../components/ui/card";
// import { Progress } from "../../../components/ui/progress";
// import { Label } from "../../../components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../components/ui/select";
// import { Alert, AlertDescription } from "../../../components/ui/alert";
// import { Upload, FileIcon, X, Plus, CheckCircle, XCircle } from "lucide-react";
// import { FileDropzone } from "../../../lib/upload/FileDropzone";
// import { formatBytes } from "../../../lib/upload/utils";
// import { uploadC } from "../../../api/app/client";
// import { UploadType } from "../../../api/upload/service";
// import { PresignedUrl } from "@/api/project/version/z.schema";

// /**
//  * 文件上传进度接口
//  */
// interface FileUploadProgress {
//   file: File;
//   loaded: number;
//   percentage: number; // 用于先计算再渲染
//   status: "pending" | "uploading" | "success" | "error";
//   error?: string;
//   result?: {
//     storageKey: string;
//     fileUrl?: string;
//   };
//   addedAt: number; // 添加时间戳用于保持顺序
// }

// type FileProgresses = Record<string, FileUploadProgress>;
// // function setFilesToProgresses(
// //   setFileProgresses: React.Dispatch<React.SetStateAction<FileProgresses>>,
// //   files: File[]
// // ) {
// //   setFileProgresses(prev => {
// //     const next = { ...prev };

// //     const existingKeys = new Set(
// //       Object.values(prev).map(p => `${p.file.name}-${p.file.size}`)
// //     );

// //     files.forEach(file => {
// //       const key = `${file.name}-${file.size}`;
// //       if (!existingKeys.has(key)) {
// //         next[file.name] = {
// //           file,
// //           loaded: 0,
// //           percentage: 0,
// //           status: 'pending',
// //           addedAt: Date.now(),
// //         };
// //       }
// //     });

// //     return next;
// //   });
// // }
// export default function UploadTestPage() {
//   const [uploadType, setUploadType] = useState<string>("other");
//   const [fileProgresses, setFileProgresses] = useState<FileProgresses>({});
//   const [isUploading, setIsUploading] = useState(false);
//   const [globalError, setGlobalError] = useState<string>("");
//   // FileDropzone 组件管理拖拽/选择状态

//   // 删除单个文件
//   const removeFile = (name: string) => {
//     const { [name]: _, ...rest } = fileProgresses;
//     setFileProgresses(rest);
//   };

//   // 统一的添加文件逻辑
//   const addFilesToSelection = (newFiles: File[]) => {
//     // 过滤掉已存在的文件（基于文件名和大小）
//     const existingFileKeys = new Set(
//       Object.values(fileProgresses).map((p) => `${p.file.name}-${p.file.size}`),
//     );
//     const uniqueNewFiles = newFiles.filter(
//       (file) => !existingFileKeys.has(`${file.name}-${file.size}`),
//     );

//     if (uniqueNewFiles.length > 0) {
//       // 为新文件初始化进度状态
//       setFileProgresses((prev) => {
//         const next = { ...prev };
//         uniqueNewFiles.forEach((file) => {
//           next[file.name] = {
//             file,
//             loaded: 0,
//             percentage: 0,
//             status: "pending",
//             addedAt: Date.now(),
//           };
//         });
//         return next;
//       });
//     }

//     setGlobalError("");
//   };

//   // 重试失败的上传
//   const retryFailedUploads = async () => {
//     const failedProgresses = Object.entries(fileProgresses).filter(
//       ([_, progress]) => progress.status === "error",
//     );

//     if (failedProgresses.length === 0) return;

//     setIsUploading(true);

//     try {
//       // 重新获取失败文件的预签名URL
//       const filesToRetry = failedProgresses.map(
//         ([_, progress]) => progress.file,
//       );
//       const presignedUrlsRes = await getPresignedUrls(filesToRetry);

//       // 创建重试上传任务
//       const retryPromises = failedProgresses.map(([fileId, progress], index) =>
//         uploadSingleFile(fileId, progress.file, presignedUrlsRes[index]),
//       );

//       await Promise.allSettled(retryPromises);
//     } catch (err) {
//       console.error("Retry error:", err);
//       if (err instanceof Error) {
//         setGlobalError(err.message);
//       } else {
//         setGlobalError("重试上传失败");
//       }
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // 更新单个文件的进度
//   const updateFileProgress = (
//     name: string,
//     updates: Partial<FileUploadProgress>,
//   ) => {
//     setFileProgresses((prev) => {
//       const current = prev[name];
//       if (!current) return prev;

//       return {
//         ...prev,
//         [name]: { ...current, ...updates },
//       };
//     });
//   };

//   const getPresignedUrls = async (files: File[]) => {
//     try {
//       const res = await uploadC.presignedUrls.$post({
//         json: {
//           uploadType: uploadType as UploadType,
//           files: files.map((file) => ({
//             name: file.name,
//             type: file.type,
//             size: file.size,
//           })),
//         },
//       });
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "获取预签名URL失败");
//       }
//       return await res.json();
//     } catch (error) {
//       console.error("获取预签名URL失败:", error);
//       throw new Error(
//         error instanceof Error ? error.message : "获取预签名URL失败",
//       );
//     }
//   };
//   // 上传单个文件
//   const uploadSingleFile = async (
//     name: string,
//     file: File,
//     presignedData: PresignedUrl,
//   ): Promise<void> => {
//     try {
//       updateFileProgress(name, { status: "uploading" });

//       // 使用XMLHttpRequest上传文件（支持进度监控）
//       const uploadPromise = new Promise<void>((resolve, reject) => {
//         const xhr = new XMLHttpRequest();

//         // 监听上传进度
//         xhr.upload.addEventListener("progress", (event) => {
//           if (event.lengthComputable) {
//             const percentage = Math.round((event.loaded / event.total) * 100);
//             updateFileProgress(name, {
//               loaded: event.loaded,
//               percentage: percentage,
//             });
//           }
//         });

//         // 监听上传完成
//         xhr.addEventListener("load", () => {
//           if (xhr.status >= 200 && xhr.status < 300) {
//             resolve();
//           } else {
//             reject(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`));
//           }
//         });

//         // 监听上传错误
//         xhr.addEventListener("error", () => {
//           reject(new Error("上传过程中发生网络错误"));
//         });

//         // 监听上传中止
//         xhr.addEventListener("abort", () => {
//           reject(new Error("上传被中止"));
//         });

//         // 开始上传
//         xhr.open("PUT", presignedData.uploadUrl);
//         xhr.setRequestHeader("Content-Type", file.type);
//         xhr.send(file);
//       });

//       await uploadPromise;

//       // 3. 验证上传结果（可选）
//       const verifyResponse = await uploadC.verify.$post({
//         json: {
//           storageKey: presignedData.storageKey,
//         },
//       });

//       let fileUrl = "";
//       if (verifyResponse.ok) {
//         const verifyData = await verifyResponse.json();
//         fileUrl = verifyData.fileUrl;
//       }

//       updateFileProgress(name, {
//         status: "success",
//         result: {
//           storageKey: presignedData.storageKey,
//           fileUrl: fileUrl,
//         },
//       });
//     } catch (err) {
//       console.error(`Upload error for ${file.name}:`, err);
//       updateFileProgress(name, {
//         status: "error",
//         error: err instanceof Error ? err.message : "上传失败",
//       });
//     }
//   };

//   // 上传所有文件
//   const uploadFiles = async () => {
//     const pendingFiles = Object.values(fileProgresses)
//       .filter((p) => p.status === "pending" || p.status === "error")
//       .map((p) => p.file);

//     if (pendingFiles.length === 0) {
//       setGlobalError("没有待上传的文件");
//       return;
//     }

//     setIsUploading(true);
//     setGlobalError("");

//     try {
//       // 1. 先批量获取所有文件的预签名URL
//       const presignedUrls = await getPresignedUrls(pendingFiles);

//       // 2. 并行上传所有文件
//       const uploadPromises = presignedUrls.map((presignedData, index) =>
//         uploadSingleFile(
//           pendingFiles[index].name,
//           pendingFiles[index],
//           presignedData,
//         ),
//       );
//       await Promise.allSettled(uploadPromises);
//     } catch (err) {
//       console.error("Upload batch error:", err);
//       if (err instanceof Error) {
//         setGlobalError(err.message);
//       } else {
//         setGlobalError("批量上传过程中出现错误");
//       }
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // 重置状态
//   const resetUpload = () => {
//     setFileProgresses({});
//     setGlobalError("");
//     setIsUploading(false);
//   };

//   // 获取排序后的文件进度数组
//   const getSortedProgresses = () => {
//     return Object.values(fileProgresses).sort((a, b) => a.addedAt - b.addedAt);
//   };

//   // 计算总体进度
//   const calculateOverallProgress = () => {
//     const progresses = Object.values(fileProgresses);
//     if (progresses.length === 0) return { percentage: 0, loaded: 0, total: 0 };

//     const totalLoaded = progresses.reduce((sum, p) => sum + p.loaded, 0);
//     const totalSize = progresses.reduce((sum, p) => sum + p.file.size, 0);
//     const percentage =
//       totalSize > 0 ? Math.round((totalLoaded / totalSize) * 100) : 0;

//     return { percentage, loaded: totalLoaded, total: totalSize };
//   };

//   const overallProgress = calculateOverallProgress();
//   const completedFiles = Object.values(fileProgresses).filter(
//     (p) => p.status === "success",
//   ).length;
//   const errorFiles = Object.values(fileProgresses).filter(
//     (p) => p.status === "error",
//   ).length;

//   return (
//     <div className="container mx-auto p-6 max-w-2xl">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Upload className="w-6 h-6" />
//             <span>文件上传测试</span>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <FileDropzone
//             setFiles={addFilesToSelection}
//             multiple={true}
//             maxSize={100 * 1024 * 1024}
//             className="border-2 border-dashed rounded-lg p-6 mb-4"
//           />

//           {/* 上传类型选择 */}
//           <div className="space-y-2">
//             <Label htmlFor="upload-type">上传类型</Label>
//             <Select
//               value={uploadType}
//               onValueChange={setUploadType}
//               disabled={isUploading}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="选择上传类型" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="avatar">头像</SelectItem>
//                 <SelectItem value="project_icon">项目图标</SelectItem>
//                 <SelectItem value="project_gallery">项目画廊</SelectItem>
//                 <SelectItem value="mod_file">模组文件</SelectItem>
//                 <SelectItem value="resource_pack">资源包</SelectItem>
//                 <SelectItem value="other">其他</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* 文件列表 */}
//           {Object.keys(fileProgresses).length > 0 && (
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <Label>已选择文件 ({Object.keys(fileProgresses).length})</Label>
//                 {!isUploading && (
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => {
//                       setFileProgresses({});
//                     }}
//                     className="text-xs"
//                   >
//                     清空全部
//                   </Button>
//                 )}
//               </div>
//               <div className="space-y-2 max-h-60 overflow-y-auto">
//                 {getSortedProgresses().map((progress) => (
//                   <Card key={progress.file.name} className="p-3 bg-muted/50">
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-3">
//                         <FileIcon className="w-6 h-6 text-muted-foreground flex-shrink-0" />
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium truncate">
//                             {progress.file.name}
//                           </p>
//                           <p className="text-xs text-muted-foreground">
//                             {formatBytes(progress.file.size)} •{" "}
//                             {progress.file.type || "未知类型"}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-2 flex-shrink-0">
//                           {progress.status === "success" && (
//                             <CheckCircle className="w-4 h-4 text-green-500" />
//                           )}
//                           {progress.status === "error" && (
//                             <XCircle className="w-4 h-4 text-red-500" />
//                           )}
//                           {progress.status === "uploading" && (
//                             <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//                           )}
//                           <span className="text-xs font-medium">
//                             {progress.percentage}%
//                           </span>
//                           {/* 删除按钮 */}
//                           {!isUploading && progress.status !== "uploading" && (
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => removeFile(progress.file.name)}
//                               className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
//                               title="删除此文件"
//                             >
//                               <X className="w-3 h-3" />
//                             </Button>
//                           )}
//                         </div>
//                       </div>

//                       {/* 单个文件进度条 */}
//                       {(progress.status === "uploading" ||
//                         progress.status === "success") && (
//                         <Progress
//                           value={progress.percentage}
//                           className="w-full h-2"
//                         />
//                       )}

//                       {/* 错误信息 */}
//                       {progress.status === "error" && progress.error && (
//                         <div className="flex items-center justify-between">
//                           <p className="text-xs text-red-500 flex-1">
//                             {progress.error}
//                           </p>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={async () => {
//                               try {
//                                 const [presignedData] = await getPresignedUrls([
//                                   progress.file,
//                                 ]);
//                                 await uploadSingleFile(
//                                   progress.file.name,
//                                   progress.file,
//                                   presignedData,
//                                 );
//                               } catch (err) {
//                                 console.error("Single file retry error:", err);
//                                 setGlobalError(
//                                   err instanceof Error
//                                     ? err.message
//                                     : "重试上传失败",
//                                 );
//                               }
//                             }}
//                             className="text-xs ml-2"
//                             disabled={isUploading}
//                           >
//                             重试
//                           </Button>
//                         </div>
//                       )}

//                       {/* 成功结果 */}
//                       {progress.status === "success" && progress.result && (
//                         <div className="text-xs space-y-1">
//                           <p className="font-mono text-green-600 bg-green-50 p-1 rounded">
//                             {progress.result.storageKey}
//                           </p>
//                           {progress.result.fileUrl && (
//                             <a
//                               href={progress.result.fileUrl}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-600 hover:underline"
//                             >
//                               查看文件
//                             </a>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* 总体上传进度 */}
//           {Object.keys(fileProgresses).length > 1 && (
//             <section aria-label="总体进度" className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span>总体进度</span>
//                 <span>
//                   {overallProgress.percentage}% ({completedFiles}/
//                   {Object.keys(fileProgresses).length} 完成)
//                 </span>
//               </div>
//               <Progress value={overallProgress.percentage} className="w-full" />
//               <div className="flex justify-between text-xs text-muted-foreground">
//                 <span>{formatBytes(overallProgress.loaded)}</span>
//                 <span>{formatBytes(overallProgress.total)}</span>
//               </div>
//               {errorFiles > 0 && (
//                 <p className="text-xs text-red-500">
//                   {errorFiles} 个文件上传失败
//                 </p>
//               )}
//             </section>
//           )}

//           {/* 全局错误信息 */}
//           {globalError && (
//             <Alert variant="destructive">
//               <XCircle className="h-4 w-4" />
//               <AlertDescription>{globalError}</AlertDescription>
//             </Alert>
//           )}

//           {/* 成功总结 */}
//           {/* {!isUploading && completedFiles > 0 && (
//           <Alert>
//             <CheckCircle className="h-4 w-4" />
//             <AlertDescription>
//               成功上传 {completedFiles} 个文件
//               {errorFiles > 0 && `, ${errorFiles} 个文件失败`}
//             </AlertDescription>
//           </Alert>
//         )} */}

//           {/* 操作按钮 */}
//           <div className="flex gap-3">
//             <Button
//               onClick={uploadFiles}
//               disabled={Object.keys(fileProgresses).length === 0 || isUploading}
//               className="flex-1"
//             >
//               {isUploading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                   上传中... ({completedFiles}/
//                   {Object.keys(fileProgresses).length})
//                 </>
//               ) : (
//                 <>
//                   <Upload className="w-4 h-4 mr-2" />
//                   开始上传{" "}
//                   {Object.keys(fileProgresses).length > 0 &&
//                     `(${Object.keys(fileProgresses).length}个文件)`}
//                 </>
//               )}
//             </Button>

//             {/* 重试按钮 */}
//             {errorFiles > 0 && !isUploading && (
//               <Button
//                 variant="outline"
//                 onClick={retryFailedUploads}
//                 className="flex-shrink-0"
//               >
//                 重试失败 ({errorFiles})
//               </Button>
//             )}

//             <Button
//               variant="outline"
//               onClick={resetUpload}
//               disabled={isUploading}
//             >
//               重置
//             </Button>
//           </div>

//           {/* 说明信息 */}
//           <div className="text-xs text-muted-foreground space-y-1">
//             <p>• 支持多文件选择、拖拽添加和单独删除，最大单文件100MB</p>
//             <p>• 使用XMLHttpRequest实现每个文件的实时进度显示</p>
//             <p>• 文件并行上传到R2存储，失败文件可单独重试</p>
//             <p>• 预签名URL有效期为1小时，支持暂停后继续上传</p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
