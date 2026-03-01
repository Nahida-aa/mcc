import { CodeBlock } from '@/components/uix/CodeBlock/client'
import type { HTMLAttributes } from 'react'

export const Pre = ({
  children,
  json = {},
  className,
  ...props
}: HTMLAttributes<HTMLPreElement> & {
  json?: any
  children?: string
}) => (
  <CodeBlock code={JSON.stringify(json, null, 2)} language="json" />
  // <pre
  //   {...props}
  //   className={cn(
  //     "wrap-break-word whitespace-pre-wrap break-all min-w-0 w-full text-sm overflow-auto bg-ctp-crust  rounded-md",
  //     className,
  //   )}
  // >
  //   <CodeBlock code={JSON.stringify(json, null, 2)} language="json" />
  //   {json ? JSON.stringify(json, null, 2) : children}
  // </pre>
)
