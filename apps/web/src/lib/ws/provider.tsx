'use client'
// lib/ws/store.tsx
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io as ioClient, type Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from './types'
import { toastMsg } from '@/components/uix/toast'
import type { AuthSession } from '@/modules/auth/auth'
import { useSession } from '@/modules/auth/hook/query'
// import { store } from '@/lib/ws/provider'
import { Store, useStore } from '@tanstack/react-store'

// type Transport = "polling" | "websocket" | "N/A";
interface IoClient extends Socket<ServerToClientEvents, ClientToServerEvents> { }
// type Transport = "polling" | "websocket" | "N/A";
interface SocketState {
  ioC: IoClient | null
  isConnected: boolean
  transport: string
}

// 初始状态
const store = new Store<SocketState>({
  ioC: null,
  isConnected: false,
  transport: 'N/A',
})
export const useSocketIo = () => useStore(store, s => s)

export const SocketIoInitializer = () => {
  // console.log('SocketIoInitializer')
  const { ioC, isConnected, transport } = useStore(store, s => s)
  // 初始化 socket（只执行一次）
  useEffect(() => {
    console.log('SocketIoInitializer:useEffect:[ioC]')
    if (ioC) return // 防止重复初始化
    console.log('SocketIoInitializer:useEffect:[ioC]:初始化')

    const socket: IoClient = ioClient('http://localhost:4000', {
      // path: wsPath,
      // addTrailingSlash: false,
      transports: ['websocket'], // 推荐强制 WS，避免 polling 无限循环
      // reconnection: true,
      // reconnectionAttempts: 5,
      // reconnectionDelay: 1000,
    })

    socket.on('connect', () => {
      store.setState(state => ({
        ...state,
        isConnected: true,
        transport: socket.io.engine.transport.name,
      }))
      socket.io.engine.on('upgrade', transport => {
        store.setState(state => ({ ...state, transport: transport.name }))
      })
    })

    socket.on('disconnect', () => {
      store.setState(state => ({ ...state, isConnected: false, transport: 'N/A' }))
    })

    socket.on('friend_request', data => {
      toastMsg(data.username, data.image, data.msg)
    })

    store.setState(state => ({ ...state, socket }))
    return () => {
      socket.disconnect()
    }
  }, [ioC])
  const { session } = useSession()
  const prevSessionRef = useRef<AuthSession | null>(null)

  // 监听 session 变化 → emit logged/logout
  useEffect(() => {
    if (!ioC || !isConnected) return
    if (session === undefined) return

    const current = session
    const prev = prevSessionRef.current
    // 从无到有：登录, emit "logged"
    if (!prev?.user?.id && current?.user?.id) {
      console.log("useSocketIo: 检测到登录，发送 'logged' 事件")
      ioC.emit('logged', current.user.id)
    } else if (prev?.user?.id && !current?.user?.id) {
      // 从有到无：退出，emit "logout"
      console.log("useSocketIo: 检测到退出，发送 'logout' 事件")
      ioC.emit('logout', prev.user.id)
    }

    prevSessionRef.current = current
  }, [session, ioC, isConnected])

  return null
}
