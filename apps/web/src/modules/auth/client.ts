import { createAuthClient } from "better-auth/react"
import {
  adminClient,
  anonymousClient,
  emailOTPClient,
  organizationClient,
  phoneNumberClient,
  twoFactorClient,
  usernameClient,
} from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  basePath: "/api/auth",
  fetchOptions: {
    onError: async context => {
      const { response } = context
      if (response.status === 429) {
        const retryAfter = response.headers.get("X-Retry-After")
        console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`)
        // context.response = new Response(
        //   JSON.stringify({
        //     message: `请求过于频繁, 请 ${retryAfter} 秒后重试`,
        //   }),
        //   { status: 429 },
        // );
      }
    },
  },
  plugins: [
    twoFactorClient(),
    usernameClient(),
    anonymousClient(),
    phoneNumberClient(),
    emailOTPClient(),
    adminClient(),
    organizationClient(),
  ],
})

type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    {
      en: string
      zh: string
    }
  >
>
const errorCodes = {
  USER_ALREADY_EXISTS: {
    en: "user already registered",
    zh: "用户已注册",
  },
  OTP_NOT_FOUND: {
    // 400
    en: "OTP not found",
    zh: "验证码不存在或已过期",
  },
  // PHONE_NUMBER_ALREADY_EXISTS: {
  //   // 400
  //   zh: "手机号已被其他用户绑定",
  // },
  // TOO_MANY_ATTEMPTS
  // TOO_MANY_ROLES
} satisfies ErrorTypes
const getErrorMessage = (code: string, lang: "en" | "zh") => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes][lang]
  }
  return ""
}
// export const {
//   signIn,
//   signOut,
//   signUp,
//   useSession,
//   getSession,

//   twoFactor,

//   updateUser,

//   phoneNumber,
// } = authClient;
// const {} = authClient.useSession();
