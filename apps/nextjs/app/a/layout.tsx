// https://nextjs.org/docs/app/getting-started/layouts-and-pages#creating-a-dynamic-segment

import { Suspense } from 'react'
import { Nav, type NavItem } from './ui/base/nav'
import { TabNav } from './ui/base/nav/TabNav'
import { ModalProvider } from '@/components/uix/modal/provider'

const navItems: NavItem[] = [
  { key: 'a' },
  { key: 'a/action' },
  { key: 'a/action/useActionState' },
  { key: 'a/action/swr' },
  { key: 'a/ui/base/nav' },
  { key: 'a/ui/modal' },
  { key: 'a/ui/form' },
  { key: 'a/ui/form/multiStep' },
  { key: 'a/ui/form/dialog' },
  { key: 'a/ui/form/select' },
  { key: 'a/ui/base/grid' },
  { key: 'a/ui/toast' },
  { key: 'a/ui/toast/inModal' },
  { key: 'a/ui/toast/inDialog' },
  { key: 'a/routes/parallel' },
  { key: 'a/routes/parallel/login' },
]

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <section className="min-h-screen grid grid-cols-[auto_1fr]">
        <Suspense fallback={<div>加载...</div>}>
          <Nav baseSegment="a" items={navItems} isVertical />
        </Suspense>
        {/* <TabNav baseSegment="a" items={navItems} isVertical /> */}
        {children}
      </section>
    </ModalProvider>
  )
}
