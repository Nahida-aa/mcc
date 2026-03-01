'use client'
// import { HeroUIProvider } from '@heroui/react'
import { ProgressProvider } from '@bprogress/next/app'
import { QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools' // bun add @tanstack/react-query-devtools
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
import { DevtoolPanel } from './DevtoolPanel'
import { getQueryClient } from './get-query-client'
export const CLientProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {/* <HeroUIProvider> */}
      <ProgressProvider
        height="3px"
        color="#a6e3a1"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {/* <ToastProvider placement="top-right"
    toastProps={{
      // variant: "flat",
      timeout: 50000,
      classNames: {
        // closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
        // base: 'items-start',
        content: 'items-start',
        icon: cn('size-5'),
        // wrapper: 'text-base',
        title: 'text-base',
        // description: 'm-1',
      },
    }}
    />  */}
        {children}
      </ProgressProvider>
      {/* </HeroUIProvider> */}
      {/* <ReactQueryDevtools /> */}
      <TanStackDevtools
        plugins={[
          {
            name: 'TanStack Query',
            render: <ReactQueryDevtoolsPanel />,
            defaultOpen: true,
          },
          formDevtoolsPlugin(),
          {
            name: 'custom-devtools',
            render: <DevtoolPanel />,
          },
        ]}
      // eventBusConfig={{ debug: true }}
      />
      {/* <DevTools /> */}
    </QueryClientProvider>
  )
}
