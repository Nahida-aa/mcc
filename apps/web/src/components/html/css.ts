import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

export const aDefault = 'text-primary hover:underline'

export const textDefault = cn('text-base [&_svg]:size-4 inline-flex items-center gap-1')
export const textSuccess = cn(textDefault, 'text-ctp-green')
export const textWarning = cn(textDefault, 'text-ctp-yellow')

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap  text-sm font-medium  disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive  active:scale-95 transition-all duration-100",
  {
    variants: {
      variant: {
        default: 'rounded-md bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'rounded-md text-destructive hover:bg-destructive hover:text-destructive-foreground focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 ',
        outline:
          'rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'rounded-md hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        noStyle: '',
        primaryIcon: 'hover:bg-accent text-primary rounded-full size-9',
        icon: 'hover:bg-accent  rounded-full size-8',
      },
      size: {
        default: 'h-8 px-3 py-2 has-[>svg]:px-3',
        sm: 'h-7 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-9 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-8',
        'icon-sm': 'size-7',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
export const buttonDefault = cn('bg-ctp-surface0 rounded-md h-9 px-1.5 flex items-center')

/**
 * 它的存在主要是为了解决 视觉层级(Visual Hierarchy) 的问题
 * 在初始状态下透明且没有边框, 只有当鼠标 悬停 才会出现 浅色背景
 * 1. 降低视觉干扰(Secondary or Tertiary Actions)
 * 如果一个页面上上布满了带背景色的按钮, 视觉上会非常混乱. ghost 变体用于次要或三次要操作, eg: 取消 按钮
 * 2. 工具栏与导航 (Toolbar Icons)
 * 在侧边栏、工具栏或页眉中, 如果有大量的图标按钮, 使用 ghost 可以让界面看起来更整洁
 * 3. 嵌入式操作 (Contextual Actions)
 * 当你要在卡片内部、列表行末尾或输入框旁边放一个按钮时, Ghost 变体能让按钮完美融入背景, 不破坏内容的连续性
 * - eg: 表格中每一行末尾的 更多选项 (三个点) 图标
 * 4. 状态切换
 * 常用于表示一种 待命 状态. 告诉用户: 这里可以点, 但我现在不想抢戏
 */
export const buttonGhost = cn(
  'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
)
export const labelCss = cn(
  'flex items-center gap-2 text-accent-foreground leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
)

export const radioVariants = cva(
  ' hover:brightness-125 active:scale-95 transition-all duration-100 bg-muted/50  rounded-full inline-flex',
  {
    variants: {
      size: {
        default: 'px-4 py-2',
        sm: 'px-2 py-1 text-sm leading-3.5',
      },
      type: {
        default: 'has-data-[state=checked]:outline-2 outline-primary',
        x: 'gap-1 has-data-[state=checked]:bg-muted/50',
        only_read: '',
      },
    },
    defaultVariants: {
      size: 'default',
      type: 'default',
    },
  },
)

export const cardDefault = cn('rounded-md bg-card text-card-foreground shadow-sm')

export const scrollbarDefault = cn(
  '[&::-webkit-scrollbar]:w-1',
  '[&::-webkit-scrollbar]:h-1',
  // "[&::-webkit-scrollbar-track]:bg-gray-100", // 轨道
  '[&::-webkit-scrollbar-thumb]:bg-ctp-surface0', // 手柄
  'hover:[&::-webkit-scrollbar-thumb]:bg-accent', // 手柄
  // "dark:[&::-webkit-scrollbar-thumb]:bg-ctp-surface0",
  '[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full',
)
export const scrollbarHidden = cn(
  '[&::-webkit-scrollbar]:w-0',
  '[&::-webkit-scrollbar]:h-0',
)

export const dialogContentVariants = cva(
  'bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 fixed z-50 shadow-lg outline-none duration-100 ',
  {
    variants: {
      size: {
        xs: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:max-w-xs rounded-lg ',
        sm: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:max-w-sm rounded-lg ',
        md: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:max-w-md rounded-lg ',
        lg: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:max-w-lg rounded-lg ',
        xl: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:max-w-xl rounded-lg ',
        '2xl':
          'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:max-w-2xl rounded-lg ',
        '5xl':
          'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  lg:rounded-lg h-full w-full lg:h-[calc(100%-5rem)]  lg:w-[calc(100%-5rem)] 2xl:max-w-364',
        full: 'inset-0 w-full h-full',
        auto: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)
