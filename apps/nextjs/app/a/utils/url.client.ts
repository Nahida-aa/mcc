"use client";

// 客户端工具函数
// 从 客户端 获得 当前 URL 基本路径
export function getAppUrl() {
  if (typeof window === "undefined") {
    return "";
  }
  const { protocol, host } = window.location;
  return `${protocol}//${host}`;
}
