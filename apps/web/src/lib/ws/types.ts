// lib/ws/types.ts

import { MsgOut } from "@/modules/community/schema/schemas";


// https://socket.io/docs/v4/typescript/
export interface ServerToClientEvents {
  msg: (msg: MsgOut) => void
  user_online: (data: { userId: string; channelId?: string }) => void
  user_offline: (data: { userId: string }) => void
  friend_request: (data: {
    senderId: string
    image?: string | null // 发送者 avatar 图片 url
    username: string
    friendTableId: string
    msg: string
  }) => void
  // noArg: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  // join: (roomId: string) => void;
  joinChannel: (channelId: string) => void
  logged: (userId: string) => void
  // 当已退出登录
  logout: (userId: string) => void
}
// InterServerEvents接口中声明的用于服务器间通信（在socket.io@4.1.0中添加）
export interface InterServerEvents {
  ping: () => void
}
// SocketData 类型用于输入 socket.data 属性
export interface SocketData {
  userId?: string
  isAnonymous?: boolean
}
