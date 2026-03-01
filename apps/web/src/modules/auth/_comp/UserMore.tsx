'use client'
// import { Modal } from '@/app/a/ui/modal/_comp/Modal'
import { useConfirm, useLoading } from '@/components/uix/modal/provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import type { UserOrTeam } from '@/modules/user/action'

import { Ellipsis } from 'lucide-react'
import { Modal } from '@/components/uix/modal/modal'
import { toast } from 'sonner'
import { Friend } from '@/modules/user/schema/schemas'

export default function UserMore({
  user,
  friend,
  name,
}: {
  user: UserOrTeam
  friend: Friend
  name: string
}) {
  const showConfirm = useConfirm()
  // const { showLoading, hideLoading, updateProgress } = useLoading()
  const handleDeleteFriend = () => {
    showConfirm({
      title: `移除好友 '${name}'`,
      description: `您确定要将 ${name} 从您的好友列表中移除吗?`,
      onConfirm: async () => {
        // showLoading("正在删除...");
        await new Promise(resolve => setTimeout(resolve, 2000))
        // hideLoading();
        toast.success('删除成功')
        // showAlert("删除成功", "项目已被永久删除。");
      },
      variant: 'destructive',
      confirmText: '删除好友',
    })
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem>个人资料</DropdownMenuItem>
          <DropdownMenuItem>消息</DropdownMenuItem>
          <DropdownMenuItem>呼叫</DropdownMenuItem>
          <DropdownMenuItem>添加好友昵称</DropdownMenuItem>
          <DropdownMenuItem>添加好友备注</DropdownMenuItem>
        </DropdownMenuGroup>
        <Separator className="my-1" />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>邀请至社区</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={handleDeleteFriend} className="text-destructive!">
            删除好友
            <Modal>Modal</Modal>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* <Separator className="my-1" />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
// import { Button } from "@/app/a/ui/base/button";
// import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem } from "@heroui/react";
// export default function UserMore() {
//   return (
//     <Dropdown>
//       <DropdownTrigger>
//         <Button variant="solid" radius="full" isIconOnly>
//           <Ellipsis className="shrink-3 size-6" />
//         </Button>
//       </DropdownTrigger>
//       <DropdownMenu aria-label="Link Actions">
//         <DropdownItem key="home" href="/home">
//           Home
//         </DropdownItem>
//         <DropdownItem key="about" href="/about">
//           About
//         </DropdownItem>
//       </DropdownMenu>
//     </Dropdown>
//   );
// }
