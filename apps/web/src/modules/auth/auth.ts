import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/lib/db' // your drizzle instance
// import { nextCookies } from "better-auth/next-js";
import * as schema from '@/lib/db/schema' // Import the schema object
import {
  admin,
  username,
  anonymous,
  openAPI,
  organization,
  phoneNumber,
  twoFactor,
  emailOTP,
  apiKey,
} from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'
import { serverBasePath } from '@/lib/config'
import { sendSms } from '@/modules/auth/phoneNumber/sendSms'
import { getTempEmail, getTempName } from '@/modules/auth/type'

// # SERVER_ERROR:  [Error [BetterAuthError]: [# Drizzle Adapter]: The model "user" was not found in the schema object. Please pass the schema directly to the adapter options.] {
//   cause: undefined
// }
export const auth = betterAuth({
  advanced: {
    cookiePrefix: 'mcc',
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24 * 2, // 1 day (every 2 day the session expiration is updated)
    // https://www.better-auth.com/docs/concepts/session-management#cookie-cache
    // 使用 类似 jwt 的机制将 session 缓存到 cookie 中, 避免一次请求多次查询数据库(可以用react.cache 进行缓存, 但对于非 jsx 渲染的 部分 不适用, 例如 ws 接口)
    cookieCache: {
      enabled: true,
      maxAge: 15 * 60, // Cache duration in seconds (15 minutes)
      strategy: 'compact', // can be "compact" or "jwt" or "jwe"
      // refreshCache: true, // Enable stateless refresh
      // refreshCache: {
      //   updateAge: 60, // Refresh when 60 seconds remain before expiry
      // },
    },
  },
  account: {
    storeStateStrategy: 'cookie',
    storeAccountCookie: true, // Store account data after OAuth flow in a cookie (useful for database-less flows)
  },
  rateLimit: {
    enabled: true, // 开发环境下也开启限制
    window: 60, // time window in seconds
    max: 100, // max requests in the window
    customRules: {
      '/phone-number/send-otp': {
        window: 45,
        max: 1,
      },
      // "/sign-in/email": {
      //   window: 10,
      //   max: 3,
      // },
      // "/two-factor/*": async (request) => {
      //   // custom function to return rate limit window and max
      //   return {
      //     window: 10,
      //     max: 3,
      //   };
      // },
    },
  },

  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
    // schema: {
    //   // ...schema,
    //   user: schema.user,
    // },
    schema: schema,
  }),
  user: {
    additionalFields: {
      realNameVerified: {
        type: 'boolean',
        defaultValue: false,
        required: true,
      },
      // summary: {
      //   type: 'string',
      //   required: false,
      // },
      // description: {
      //   type: 'string',
      //   required: false,
      // },
      // // 生日
      // birthday: {
      //   type: 'date',
      //   required: false,
      // },
      // personalizedRecommendation: {
      //   type: 'boolean',
      //   defaultValue: false,
      // },
      // color: {
      //   type: 'string',
      //   required: false,
      // },
      // banner: {
      //   type: 'string',
      //   required: false,
      // },
    },
    deleteUser: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'https://xn--2qqt0eizbxcx84dyq3c.cn',
  ],
  // appName: "auth",
  // baseURL: "http://localhost:3000",
  basePath: `/${serverBasePath}/auth`,
  plugins: [
    nextCookies(), // Server Action Cookies
    twoFactor(), // 2FA: 即验证两次,且使用不同因素,开发初期不用考虑,
    anonymous(), // user.isAnonymous: boolean
    // add: twoFactor: Table, user.twoFactorEnabled: boolean,
    username({
      minUsernameLength: 1, // 最小用户名长度, default 3
      // maxUsernameLength: 20, // 最大用户名长度, default 30
      usernameValidator: username => {
        // 默认在 规范化前运行
        // 允许中文
        const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/ // 中文、字母、数字、下划线
        return usernameRegex.test(username)
      },
      usernameNormalization: false, // 是否规范化用户名（如转换为小写）, default true
    }),
    // username(),
    // add: user.username: unique; user.displayUsername: text

    phoneNumber({
      sendOTP: async ({ phoneNumber, code }, request) => {
        console.log(`发送验证码: ${phoneNumber}, ${code}`)
        if (process.env.NODE_ENV === 'development') {
          // 假设 等待 5 秒发送验证码
          await new Promise(resolve => setTimeout(resolve, 5000))
          console.log(code)
          throw new Error('开发环境')
          // return
        }

        await sendSms(phoneNumber, code)
      },
      sendPasswordResetOTP: async ({ phoneNumber, code }, request) => {
        console.log(`发送重置密码请求验证码: ${phoneNumber}, ${code}`)
        if (process.env.NODE_ENV === 'development') return
        await sendSms(phoneNumber, code)
      },
      signUpOnVerification: {
        getTempEmail,
        getTempName,
      },
    }), // add: user.phoneNumber: text,unique; user.phoneNumberVerified: boolean
    // nodemailer TODO: 实现邮件发送
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'sign-in') {
          // Send the OTP for sign in
        } else if (type === 'email-verification') {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
        }
        if (process.env.NODE_ENV === 'development') {
          // 开发环境：控制台输出
          console.log(`🔥 开发模式 - 邮箱验证码`)
          console.log(`📧 邮箱: ${email}`)
          console.log(`🔢 验证码: ${otp}`)
          console.log(`📋 类型: ${type}`)
          console.log(`⏰ 有效期: 5分钟`)
          console.log(`----------------------------------------`)
          return
        }

        // 生产环境：实现真实的邮件发送
        // TODO: 集成邮件服务（如 Nodemailer、SendGrid 等）
        console.warn('生产环境邮件服务未配置')
        throw new Error('邮件服务暂不可用')
      },
    }),
    admin(),
    organization({
      schema: {
        organization: {
          additionalFields: {
            // better-auth 1.3, @latest
            summary: {
              type: 'string',
              input: true,
              required: false,
            },
            description: {
              type: 'string',
              input: true,
              required: false,
            },
          },
        },
      },
    }),
    apiKey(),
    openAPI(), // basePath/reference: open-api doc
  ],
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   },
  // },
  // secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-here",
})
export const { getSession } = auth.api

// type Session = typeof auth.$Infer.Session
// export type AuthType = {
//   user: typeof auth.$Infer.Session.user | null;
//   session: typeof auth.$Infer.Session.session | null;
// };
export type AuthUser = typeof auth.$Infer.Session.user & { username: string }
export type AuthSession = {
  user: AuthUser
  session: typeof auth.$Infer.Session.session
}
// export type AuthTypeNotNull = {
//   user: typeof auth.$Infer.Session.user;
//   session: typeof auth.$Infer.Session.session;
// };

// export type SessionUser = typeof auth.$Infer.Session.user;
