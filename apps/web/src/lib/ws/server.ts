// lib/ws/server.ts
import type { Server as HttpServer } from 'node:http'
import { Server as IoServer } from 'socket.io'
// import { wsPath } from '../config'
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './types'
import { instrument } from '@socket.io/admin-ui'
// import bcryptjs from 'bcryptjs'

// TypeScript 全局声明（放文件顶部）
declare global {
  var io:
    | IoServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
    | undefined
  // 全局在线用户跟踪（开发用内存；生产用 Redis/ioredis）
  var onlineUsers: Map<string, Set<string>> // userId -> Set<socketId>
}

export const initOnlineUsers = () => {
  globalThis.onlineUsers = new Map<string, Set<string>>()
  return globalThis.onlineUsers
}
export const isOnline = (userId: string) => {
  const wsIds = onlineUsers.get(userId)
  console.log('lib/ws/server.ts isOnline:', userId, wsIds, onlineUsers)
  if (wsIds) {
    return wsIds.size > 0
  }
  return false
}
export const listWsByUser = (userId: string) => {
  const wsIds = onlineUsers.get(userId)
  console.log('listWsByUser:', userId, wsIds, onlineUsers)
  if (wsIds) {
    return Array.from(wsIds)
  }
}
export const addOnlineUser = (userId: string, wsId: string) => {
  const wsIds = onlineUsers.get(userId) || new Set<string>()
  wsIds.add(wsId)
  onlineUsers.set(userId, wsIds)
}

// 初始化函数（只调用一次）
export function initIo(httpServer: HttpServer) {
  if (globalThis.io) {
    console.log('Socket.IO already initialized')
    return globalThis.io
  }
  var io = new IoServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    // path: wsPath, // 或 wsPath.app，如果你有
    addTrailingSlash: false,
    cors: {
      origin: ['https://admin.socket.io'],
      credentials: true,
    },
    maxHttpBufferSize: 1e6, // 1MB 限请求体
    pingTimeout: 15000, // 15s 心跳，防 zombie
    allowEIO3: true, // 兼容旧客户端，减 polling 开销
  })

  const onlineUsers = initOnlineUsers()
  // 新增：用户房间跟踪 Map<userId, Set<roomId>>
  const userRooms = new Map<string, Set<string>>()
  const setRoom = (userId: string, roomIds?: Set<string>) => {
    const rooms = userRooms.get(userId) ?? new Set()
    if (roomIds) {
      for (const roomId of roomIds) {
        rooms.add(roomId)
      }
    }
    userRooms.set(userId, rooms)
  }
  // io.use((socket, next) => {
  //   // const isHandshake = socket.request.sid === undefined;
  //   // console.log('ws.middleware:', socket.request.headers)
  //   next()
  // })
  io.on('connection', async socket => {
    console.log(`ws.connection ${socket.id} connected`)
    // const session = await auth.api.getSession({ headers: socket.request.headers as any })
    // const userId = session?.user.id
    // if (userId) {
    //   addOnlineUser(userId, socket.id)
    //   // 初始化用户房间 set （如果之前有房间记录，恢复；否则空）
    //   setRoom(userId)
    // }
    socket.on('logged', userId => {
      console.log(`ws.logged ${socket.id} user: ${userId}`)
      socket.data.userId = userId
      addOnlineUser(userId, socket.id)
      setRoom(userId, socket.rooms)
    })
    socket.on('logout', userId => {
      // 推出登录
      console.log(`ws.logout ${socket.id} user: ${userId}`)
      const wsIds = onlineUsers.get(userId)
      // 如果是 wsId 最后一个，则表示 用户下线
      const isEndWsId = wsIds?.size === 1
      if (isEndWsId) {
        console.log(`ws.logout user: ${userId} left all rooms`, socket.rooms)
        const rooms = Array.from(socket.rooms).filter(room => room !== socket.id) // 排除自身
        if (rooms.length > 0) {
          socket.to(rooms).emit('user_offline', { userId })
        }
        userRooms.delete(userId)
        onlineUsers.delete(userId)
      } else {
        // 非最后，移除当前 socket
        wsIds?.delete(socket.id)
      }
    })
    socket.on('joinChannel', channelId => {
      const userId = socket.data.userId
      const room = `channel_${channelId}`
      socket.join(room)
      console.log(`ws.joinChannel ${socket.id} joined channel_${channelId}`)
      if (!userId) return
      // 维护用户房间记录（避免重复加）
      const rooms = userRooms.get(userId) ?? new Set()
      rooms.add(room)
      userRooms.set(userId, rooms)
      socket.to(room).emit('user_online', { userId, channelId })
    })
    socket.on('disconnect', reason => {
      const userId = socket.data.userId
      console.log(`ws.disconnect ${socket.id} user: ${userId} reason: ${reason}`) // ping timeout | transport error
      if (!userId) return
      const wsIds = onlineUsers.get(userId)
      wsIds?.delete(socket.id)
      if (wsIds?.size === 0) {
        // 当前用户的 wsIds 为空, 则表示 用户下线
        // 现在用 userRooms 遍历房间 emit
        const rooms = userRooms.get(userId)! // 不能用 socket.rooms，因为当断开时, rooms 为空
        console.log(`ws.disconnect user: ${userId} left all channels`, rooms)
        onlineUsers.delete(userId)
        for (const room of rooms) {
          socket.to(room).emit('user_offline', { userId })
        }
        userRooms.delete(userId)
      }
    })
  })

  instrument(io, {
    auth: false,
    mode: 'development',
  })
  console.log('Socket.IO initialized')
  return io
}
