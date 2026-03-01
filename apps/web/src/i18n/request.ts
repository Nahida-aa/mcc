import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  // Static for now, we'll change this later
  const locale = cookieStore.get("locale")?.value || "zh" // en, zh 是 语言代码, us, cn 是 国家代码

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
