import { VersionWithFiles } from "../action/version"
import { ProjectSelect } from "../types/index.t"

export interface NagContext {
  /**
   * The project associated with the nag.
   */
  project: ProjectSelect
  /**
   * The versions associated with the project.
   */
  versions: VersionWithFiles[]
  currentPathname: string
}
// import { serverEnv } from '@/lib/env/server'

// console.log('Environment:', JSON.stringify(process.env));

// export const wsServerUrl = process.env.wsServerUrl || `ws${isProd ? 's' : ''}://${serverHost}:${serverPort}`;

// assert(process.env.S3_PUBLIC_URL, "S3_PUBLIC_URL 未设置");
export const imageMaxSize = 1024 * 1024 * 10 // 10MB

export const projectNags = [
  {
    id: 'add-summary',
    title: '添加摘要',
    description: '添加项目摘要，方便用户搜索和浏览。',
    status: 'required',
    shouldShow: (c: NagContext) => c.project.summary === '',
    link: 'settings',
    linkText: '前往摘要设置',
  },
  {
    id: 'add-description',
    title: '添加描述',
    description: '清楚描述项目的目的和功能',
    status: 'required',
    shouldShow: (c: NagContext) =>
      c.project.description === '' || c.project.description === null,
    link: 'settings/description',
    linkText: '前往描述设置',
  },
  {
    id: 'select-environments',
    title: '设置环境',
    description: (c: NagContext) => {
      return `为你的 ${c.project.type} 选择适用环境`
    },
    status: 'required',
    shouldShow: (c: NagContext) => {
      const excludedTypes = ['resourcepack', 'plugin', 'shader', 'datapack']
      return (
        c.versions.length > 0 &&
        !excludedTypes.includes(c.project.type) &&
        !c.project.environment
      )
    },
    link: 'settings/environment',
    linkText: '前往环境设置',
  },
  {
    id: 'select-license',
    title: '选择许可',
    description: (c: NagContext) => `请选择${c.project.type}的分发许可证`,
    status: 'required',
    shouldShow: (c: NagContext) => c.project.license === null,
    link: 'settings/license',
    linkText: '前往许可设置',
  },
  {
    id: 'banner-image',
    title: '封面',
    description: '封面通常是用户对你的项目的第一印象',
    status: 'suggestion',
    shouldShow: (c: NagContext) => c.project.cover !== null,
    link: 'settings',
    linkText: '前往常规设置',
  },
  {
    id: 'upload-version',
    title: '上传版本',
    description: '在项目提交审核之前，至少有一个版本',
    status: (c: NagContext) =>
      c.project.status === 'preparing' ? 'required' : 'warning',
    shouldShow: (c: NagContext) => c.versions.length < 1,
    link: 'versions',
    linkText: '前往版本页面',
  },
  {
    id: 'summary-too-short',
    title: '扩充摘要',
    description: (c: NagContext) =>
      `你的摘要长度为 ${c.project.summary.length} 个字。建议至少使用 15 个字，以便创建一个信息丰富且吸引人的摘要`,
    status: 'warning',
    shouldShow: (c: NagContext) => c.project.summary.length < 15,
    link: 'settings',
    linkText: '前往常规设置',
  },
  {
    id: 'submit-for-review',
    title: '提交审核',
    description: (c: NagContext) => {
      if (c.project.status === 'preparing') return '至少一个版本,以进入发布状态'
      return '你的项目目前只有项目成员可以查看'
    },
    status: 'special-submit-action',
    shouldShow: (c: NagContext) =>
      ['draft', 'rejected', 'preparing'].includes(c.project.status),
  },
] as const