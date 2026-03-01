'use client'
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

export default function UserMoreBySelf({ userId }: { userId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="icon">
          <Ellipsis className="shrink-4 size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(userId)}>
          复制用户ID
        </DropdownMenuItem>
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
