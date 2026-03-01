// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// // Zod schema
// const formSchema = z.object({
//   name: z.string().min(3, {
//     message: "用户名至少需要 3 个字符",
//   }),
// });

// export default function FormDialogExample() {
//   const [open, setOpen] = useState(false);

//   // ✅ 正确方式：useForm 在组件顶层初始化
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     mode: "onChange",
//     defaultValues: {
//       name: "",
//     },
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log("[v0] Form submitted successfully:", values);
//     setOpen(false);
//     form.reset(); // 提交后重置表单
//   }

//   // ✅ 关键：Dialog 关闭时重置表单
//   const handleOpenChange = (newOpen: boolean) => {
//     setOpen(newOpen);
//     if (!newOpen) {
//       form.reset(); // Dialog 关闭时清除验证错误
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center p-4">
//       <div className="w-full max-w-2xl space-y-8">
//         <div className="space-y-2">
//           <h1 className="text-3xl font-bold">Form Dialog 示例</h1>
//           <p className="text-muted-foreground">
//             演示如何在 Dialog 中正确使用 React Hook Form + Zod 验证
//           </p>
//         </div>

//         {/* ✅ 正确示例：Form 包裹在外层 */}
//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold">✅ 正确方式</h2>
//           <p className="text-sm text-muted-foreground">
//             Form 组件在 Dialog 外层，验证错误能正确显示在 UI 上
//           </p>

//           <Form {...form}>
//             <Dialog open={open} onOpenChange={handleOpenChange}>
//               <DialogTrigger asChild>
//                 <Button>打开表单对话框（正确）</Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                   <DialogTitle>编辑个人信息</DialogTitle>
//                   <DialogDescription>填写以下信息。点击保存按钮提交。</DialogDescription>
//                 </DialogHeader>

//                 {/* ✅ Form 在 Dialog 外层定义，在 DialogContent 内渲染表单字段 */}
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                   <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>用户名</FormLabel>
//                         <FormControl>
//                           <Input placeholder="输入用户名" {...field} />
//                         </FormControl>
//                         {/* ✅ FormMessage 会自动显示验证错误 */}
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <DialogFooter>
//                     <Button type="submit">
//                       {form.formState.isSubmitting ? "保存中..." : "保存"}
//                     </Button>
//                   </DialogFooter>
//                 </form>
//               </DialogContent>
//             </Dialog>
//           </Form>
//         </div>

//         {/* 错误示例说明 */}
//         <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 space-y-2">
//           <h2 className="text-xl font-semibold text-destructive">❌ 常见错误原因</h2>
//           <ul className="list-disc list-inside space-y-1 text-sm">
//             <li>
//               <strong>Form 组件位置错误：</strong>如果 Form 组件在 DialogContent
//               内部，可能导致 Context 无法正确传递
//             </li>
//             <li>
//               <strong>未正确重置表单：</strong>Dialog 关闭时没有调用
//               form.reset()，导致旧的验证状态残留
//             </li>
//             <li>
//               <strong>字段名不匹配：</strong>FormField 的 name 属性与 Zod schema
//               中的键名不一致
//             </li>
//             <li>
//               <strong>缺少 FormMessage：</strong>忘记在 FormItem 中添加 FormMessage 组件
//             </li>
//             <li>
//               <strong>Portal 导致的 Context 问题：</strong>Dialog 使用 Portal 渲染，但
//               FormProvider Context 没有正确覆盖到 Portal 内容
//             </li>
//           </ul>
//         </div>

//         {/* 调试技巧 */}
//         <div className="rounded-lg border bg-muted p-4 space-y-2">
//           <h2 className="text-xl font-semibold">🔍 调试技巧</h2>
//           <div className="space-y-2 text-sm">
//             <p>如果验证错误仍然不显示，尝试以下方法：</p>
//             <ol className="list-decimal list-inside space-y-1">
//               <li>打开浏览器控制台，检查是否有 React Context 相关错误</li>
//               <li>在 FormMessage 组件中添加 console.log 查看 error 对象</li>
//               <li>
//                 确认 zodResolver 正确导入：import {"{ zodResolver }"} from
//                 '@hookform/resolvers/zod'
//               </li>
//               <li>
//                 验证 FormField 的 control 属性正确传递：control={"{"}form.control{"}"}
//               </li>
//               <li>检查 Dialog 的 open 状态是否受控，确保 onOpenChange 正确处理</li>
//             </ol>
//           </div>
//         </div>

//         {/* 查看当前表单状态 */}
//         <div className="rounded-lg border bg-card p-4 space-y-2">
//           <h2 className="text-xl font-semibold">📊 当前表单状态（调试用）</h2>
//           <pre className="text-xs bg-muted p-2 rounded overflow-auto">
//             {JSON.stringify(
//               {
//                 values: form.watch(),
//                 errors: form.formState.errors,
//                 isDirty: form.formState.isDirty,
//                 isValid: form.formState.isValid,
//               },
//               null,
//               2,
//             )}
//           </pre>
//         </div>
//       </div>
//     </div>
//   );
// }
