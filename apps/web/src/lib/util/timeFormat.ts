import {
  format,
  formatDistance,
  formatRelative,
  subDays,
  formatDistanceToNow,
  parseISO,
} from "date-fns"
import type { Locale } from "date-fns" // 可选：支持多语言
import { es, zhCN } from "date-fns/locale"

export const formatToNow = (time: Date | string) => {
  const date = typeof time === "string" ? parseISO(time) : time
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: zhCN,
  })
}
