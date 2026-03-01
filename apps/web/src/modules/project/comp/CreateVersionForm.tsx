import z from 'zod'
// import { useForm, Controller, FormProvider } from "react-hook-form"
import {
  createFormHookContexts,
  createFormHook,
  useStore,
  type AnyFieldMeta,
  type FieldApi,
} from '@tanstack/react-form'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldGroup,
  FieldTitle,
  FieldSet,
  FieldLegend,
} from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeftRight, ChevronLeft, ChevronRight, XIcon } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FileInput } from '@/components/uix/file-input'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldContent } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { MailIcon } from 'lucide-react'
// import { RichTextEditor } from "@/components/ui/editor/rich-text-editor";
import { useDebounceCallback } from 'usehooks-ts' // 新增

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useModal } from '@/components/uix/modal/provider'
import { Button, Pre } from '@/components/uix/html'
import FileDropzone from '@/modules/upload/FileDropzone'
import manifestData from '@/data/minecraft-manifest.json'
import { versionAcceptStr } from '@/modules/upload/utils'
import { useProject, useVersions } from '@/modules/project/hook/query'
import { inferVersionInfo, type VersionType } from '@/modules/minecraft/inferVersionFile'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { versionTypeOptions } from '@/modules/project/types/index.t'
import { Item, ItemActions, ItemContent, ItemTitle } from '@/components/ui/item'
import { buttonVariants, radioVariants, scrollbarDefault } from '@/components/html/css'
import { createVersion } from '@/modules/project/action/version'
import { allLoaders } from '@/modules/project/schema/constants'
import { FileItem, useAppForm } from '@/hooks/useAppForm'
import { useFileUpload } from '@/modules/upload/useFileUpload'
import { toastError } from '@/components/uix/toast'
import { toast } from 'sonner'
import { useSlugParams } from '@/hooks/useParams'

const formSchema = z.object({
  versionFiles: z
    .object({
      file: z.instanceof(File),
      fileRole: z.string().optional(),
    })
    .array()
    .min(1, '至少选择一个文件'), // z.array(z.instanceof(File))
  versionType: z.enum(['release', 'beta', 'alpha']).optional(),
  versionNumber: z.string().max(255, '版本号必须小于255字符'),
  name: z.string().max(255, '名称必须小于255字符'), // 版本标题
  loaders: z.enum(allLoaders).array().optional(),
  gameVersions: z.array(z.string()).optional(),
  changelog: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>
type FormKey = keyof FormValues
type StepId = number | string // 主线用 number，支线用 'branch-xxx'
type Step = {
  title: string
  fields: string[]
  nextSteps: StepId[] // 可能的下一个（用于插入/桥接）
  condition?: (values: FormValues) => boolean // 自动显示（undefined = 总是 true）
}
// multi step
export const CreateVersionForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  console.log('CreateVersionForm')

  const steps: Record<StepId, Step> = {
    0: {
      title: '文件',
      fields: ['versionFiles'],
      nextSteps: [1],
    },
    1: {
      title: '元数据',
      fields: ['loaders', 'gameVersions'],
      nextSteps: [2, 'loaders'],
    },
    loaders: {
      title: '设置加载器',
      fields: ['loaders'],
      condition: (values: FormValues) => !values?.loaders, // 如果有加载器就从 当前路径上 移除
      nextSteps: [2, 'gameVersions'],
    },
    gameVersions: {
      title: '设置游戏版本',
      fields: ['gameVersions'],
      condition: (values: FormValues) => !values?.gameVersions, // 如果有游戏版本就从 当前路径上 移除
      nextSteps: [2],
    },
    2: {
      title: '详情',
      fields: ['versionType', 'versionNumber', 'name', 'changelog'],
      nextSteps: [],
    },
  } // 类型断言：const 变量不能再次赋值，只能用 const 声明
  // type StepId = keyof typeof steps
  const initialPath: StepId[] = [0, 1, 'loaders', 'gameVersions', 2]
  const [currentStepId, setCurrentStepId] = useState<StepId>(initialPath[0]) // 当前步骤 (currentStepId)：用于显示内容 – 当前 ID 对应具体 step 配置（title、fields），渲染 UI（e.g., form.Field for fields）。它像“当前页面”，决定屏幕上什么。

  const [stepHistory, setStepHistory] = useState<StepId[]>([initialPath[0]]) // 路径栈
  // 历史 (stepHistory)：用于返回 – 栈结构记录访问路径（push Next/jump，pop Back），Back 时 pop 取上一节点（智能优先主线，避免卡支线）。它像“面包屑”，防迷路。
  const slug = useSlugParams()
  const { project } = useProject(slug)
  const { refetch } = useVersions(project?.id)
  const { uploadFiles, status } = useFileUpload('version')
  const form = useAppForm({
    validators: {
      onChange: formSchema,
    },
    defaultValues: {
      versionFiles: [] as FormValues['versionFiles'],
      versionType: 'release',
      // versionNumber: "",
    } as FormValues,
    onSubmit: async ({ value }) => {
      if (!project) return
      const { versionFiles, ...data } = value
      console.log('form.onSubmit:', value)
      // 1. 上传文件
      const ret = await uploadFiles(versionFiles.map(it => it.file))
      if (ret?.length === versionFiles.length) {
        // 构建 files: {fileId, fileRole}[]
        const files = ret.map((file, idx) => ({
          fileId: file.id,
          fileRole: versionFiles[idx].fileRole,
        }))
        // 2. 创建版本
        const ret1 = await createVersion({
          projectId: project.id,
          files,
          ...data,
        })
        toast.success('创建版本成功')
        await refetch()
        onSuccess?.()
        return
      }
      toastError(status, '上传文件失败')
    },
  })
  const values = useStore(form.store, state => state.values)
  // 路径 (currentPath)：直接对应进度 – 它是动态计算的完整步骤序列（主线 + 符合 condition 的支线），进度条基于当前索引 / 路径总长（e.g., 2/5 = 40%）。它像“地图”，总览流程长度。
  // 当前路径：基于 initialPath 动态计算（自动插/删）
  const currentPath = useMemo(() => {
    const path = [...initialPath] // 从种子开始

    // 递归扩展：遍历加入符合 condition 的 nextSteps
    const expandPath = (currentPath: StepId[]): StepId[] => {
      return currentPath.reduce((acc, stepId, idx) => {
        const step = steps[stepId] // ← 对象 O(1) 查找
        if (!step) return acc

        // 加入当前
        // const newAcc = [...acc, stepId]
        acc.push(stepId)

        // 自动加入下一个符合的
        for (const nextId of step.nextSteps) {
          const nextStep = steps[nextId]
          if (
            nextStep &&
            !path.includes(nextId) &&
            (nextStep.condition?.(values) ?? true)
          ) {
            acc.splice(idx + 1, 0, nextId) // 插入
            // 递归扩展新加入的
            const extended = expandPath([nextId])
            acc.splice(idx + 1 + 1, 0, ...extended.slice(1))
          }
        }

        return acc
      }, [] as StepId[])
    }

    let fullPath = expandPath(path)

    // 自动删除不符的（filter + 桥接 nextSteps）
    fullPath = fullPath.filter(stepId => {
      const step = steps[stepId]
      return step && (step.condition?.(values) ?? true)
    })

    // 桥接删除后断开的：如果 A → C（删 B），确保 A nextSteps 连 C
    // 简化：重新从头扩展（已含）
    return fullPath
  }, [values, steps[currentStepId]]) // 值变时重算
  const progress = ((currentPath.indexOf(currentStepId) + 1) / currentPath.length) * 100
  const isFirstStep = currentPath.indexOf(currentStepId) === 0
  const isLastStep = progress === 100
  const versionFiles = useStore(form.store, state => state.values.versionFiles)
  const releaseVersions = manifestData.versions
    .filter(it => it.type === 'release')
    .map(it => it.id)

  const inferFile = async (file: File) => {
    try {
      const fileInfo = await inferVersionInfo({
        file,
        project: { type: project!.type, name: project!.name },
        releaseVersions,
      })

      console.log('fileInfo:', fileInfo)
      // 加 isDirty 检查：只在字段“干净”（未手动修改）时更新
      const versionTypeMeta = form.getFieldMeta('versionType')
      const versionNumberMeta = form.getFieldMeta('versionNumber')
      const nameMeta = form.getFieldMeta('name')
      const loadersMeta = form.getFieldMeta('loaders')
      const gameVersionsMeta = form.getFieldMeta('gameVersions')
      if (!versionTypeMeta?.isDirty)
        form.setFieldValue('versionType', fileInfo.versionType)
      if (!versionNumberMeta?.isDirty)
        form.setFieldValue('versionNumber', fileInfo.versionNumber)
      if (!nameMeta?.isDirty) form.setFieldValue('name', fileInfo.name)
      if (!loadersMeta?.isDirty) form.setFieldValue('loaders', fileInfo.loaders)
      if (!gameVersionsMeta?.isDirty)
        form.setFieldValue('gameVersions', fileInfo.gameVersions)
    } catch (error) {
      console.error('保存失败:', error)
    }
  }
  // 验证 部分字段
  const handleNext = async () => {
    const currentFields = steps[currentStepId].fields
    // 验证v
    await Promise.all(
      currentFields.map(name => form.validateField(name as FormKey, 'change')),
    )
    // 检查
    const hasErrors = currentFields.some(field => {
      const errLen = form.getFieldMeta(field as FormKey)?.errors.length
      return errLen ? errLen > 0 : false
    })
    if (!hasErrors && !isLastStep) {
      const idx = currentPath.indexOf(currentStepId)
      const nextId = currentPath[idx + 1]
      setCurrentStepId(nextId)
      setStepHistory(prev => [...prev, nextId])
      console.log('下一步:', nextId)
      return
    }
    console.log('无法下一步, 验证未通过')
  }
  const handleBack = () => {
    // pop 栈
    const prevHistory = stepHistory.slice(0, -1)
    let targetId = prevHistory[prevHistory.length - 1] // 栈顶前一个
    // 智能：优先回主线（你的需求）
    const mainLineSteps: StepId[] = initialPath.filter(id => typeof id === 'number') // 假设主线 ID 是 number
    const lastMainIndex = prevHistory.findLastIndex(id => mainLineSteps.includes(id))
    if (lastMainIndex !== -1) {
      targetId = prevHistory[lastMainIndex] // 跳最近主线
    }
    setStepHistory(prevHistory)
    setCurrentStepId(targetId)
    console.log(`返回到步: ${targetId}`)
  }
  // 函数实现
  const jumpToStep = (targetId: StepId) => {
    // 跳转：set ID，推栈
    setCurrentStepId(targetId)
    setStepHistory(prev => [...prev, targetId])
    console.log(`跳转到步: ${targetId}`)
  } // 依赖当前 ID 和 form

  const fileInputRef = useRef<HTMLInputElement>(null)
  const renderCurrentStepContent = () => {
    switch (currentStepId) {
      case 0: {
        return (
          <FieldGroup>
            <form.AppField
              name="versionFiles"
              mode="array"
              children={field => (
                <Field data-invalid={!field.state.meta.isValid}>
                  {field.state.meta.errors && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                  {/* 新增：切换主文件按钮 */}
                  {field.state.value.length > 0 && (
                    <>
                      <FieldLabel>主要文件</FieldLabel>
                      <FileItem file={field.state.value[0].file}>
                        <Button
                          variant="ghost"
                          className="rounded-full"
                          size="icon"
                          onClick={e => {
                            e.preventDefault() // 防默认行为
                            e.stopPropagation() // 防冒泡到 form
                            console.log('切换主文件')
                            fileInputRef.current?.click()
                          }}
                        >
                          <ArrowLeftRight />
                        </Button>
                      </FileItem>
                      <FieldDescription>主文件是下载时的默认文件</FieldDescription>
                      <FieldLabel>补充文件</FieldLabel>
                    </>
                  )}
                  {/* 隐藏文件输入：用于系统选择器 */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={versionAcceptStr}
                    className="hidden"
                    onChange={e => {
                      console.log('input(file)')
                      const newFile = e.target.files?.[0]
                      if (newFile && field.state.value.length > 0) {
                        // 替换 primary（index 0），保持 fileRole
                        const updatedFiles = [...field.state.value]
                        updatedFiles[0] = {
                          file: newFile,
                          fileRole: 'primary', // 强制 primary
                        }
                        field.handleChange(updatedFiles) // 更新整个数组（替换 primary 后重设，简单可靠）
                        // 清空 input
                        console.log('清空 input')
                        e.target.value = ''
                      }
                    }}
                  />

                  <FileInput
                    value={
                      Array.isArray(field.state.value)
                        ? field.state.value.map(i => i.file)
                        : []
                    }
                    onChange={files => {
                      const currentFiles = field.state.value
                      const newFileObjects = files
                        .filter(
                          newFile =>
                            !currentFiles.some(
                              existing =>
                                existing.file.name === newFile.name &&
                                existing.file.size === newFile.size,
                            ),
                        )
                        .map(newFile => ({
                          file: newFile,
                          fileRole: currentFiles.length === 0 ? 'primary' : 'other', // 第一个为 primary，后续 other
                        }))

                      newFileObjects.forEach(newItem => {
                        field.pushValue(newItem) // 逐个 push，避免替换全部
                      })
                      inferFile(files[0]) // 推算版本信息
                    }}
                    key={field.state.value.length} // ← 新增：key 基于长度，删除时重 mount 组件，清内部状态
                    aria-invalid={!field.state.meta.isValid}
                    showPreview={false}
                    accept={versionAcceptStr}
                  />

                  {versionFiles.length > 0 && (
                    <>
                      {versionFiles.slice(1).map((i, index) => (
                        <FileItem key={index} file={i.file}>
                          <Button
                            variant="ghost"
                            className="rounded-full"
                            size="icon"
                            onClick={e => {
                              e.preventDefault() // 防默认行为
                              e.stopPropagation() // 防冒泡到 form
                              console.log('删除文件', i.file.name)
                              field.removeValue(index + 1)
                            }}
                          >
                            <XIcon />
                          </Button>
                        </FileItem>
                      ))}
                      <FieldDescription>
                        您可以选择添加补充文件，例如源代码、文档或所需的资源包。
                      </FieldDescription>
                    </>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        )
      }

      case 1: {
        return (
          <FieldGroup>
            <form.AppField name="loaders">{field => <field.Loaders />}</form.AppField>
            <form.AppField name="gameVersions">
              {field => <field.MinecraftVersions />}
            </form.AppField>
          </FieldGroup>
        )
      }

      case 2: {
        return (
          <FieldGroup>
            <form.AppField name="versionType">
              {field => (
                <field.FieldRadioGroup title="版本类型" options={versionTypeOptions} />
              )}
            </form.AppField>
            <form.AppField name="versionNumber">
              {field => (
                <field.FieldInput
                  title="版本号"
                  required
                  description="版本号用于区分此版本与其他版本"
                />
              )}
            </form.AppField>
            <form.AppField name="name">
              {field => <field.FieldInput title="标题" />}
            </form.AppField>
            <form.AppField name="changelog">
              {field => <field.TextareaField title="更新日志" />}
            </form.AppField>
          </FieldGroup>
        )
      }

      default: {
        return null
      }
    }
  }

  return (
    <form.AppForm>
      <form.Form className="space-y-4" onSubmit={form.handleSubmit}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2>{steps[currentStepId].title}</h2>
          </div>
          <Progress value={progress} />
        </div>
        {renderCurrentStepContent()}
        {/* <Pre json={form.watch()} /> */}
        <Field className="justify-between" orientation="horizontal">
          {!isFirstStep ? (
            <Button type="button" variant="ghost" onClick={handleBack}>
              <ChevronLeft /> 上一步
            </Button>
          ) : (
            <div></div>
          )}
          {!isLastStep && (
            <form.NextButton
              isFirstStep={isFirstStep}
              currentFields={steps[currentStepId].fields}
              handleNext={handleNext}
            />
          )}

          {isLastStep && <form.SubmitButton />}
        </Field>
        <form.Subscribe selector={state => state.values}>
          {values => <Pre json={values} />}
        </form.Subscribe>
      </form.Form>
    </form.AppForm>
  )
}
