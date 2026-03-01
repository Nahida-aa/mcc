'use client'
import { passwordSchema, phoneOrEmailSchema, getInputType } from '../type'
import { User2Icon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '../client'
import Link from 'next/link'
import { toastError } from '../../../components/uix/toast'
import z from 'zod'

import { useSession } from '@/modules/auth/hook/query'
import { useAppForm } from '@/hooks/useAppForm'

const formSchema = z.object({
  phoneNumberOrEmail: phoneOrEmailSchema,
  password: passwordSchema,
  isAgree: z.literal(true, { message: '需要同意用户协议与隐私政策' }),
})

export const PasswordSignIn = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/'
  const { refetch } = useSession()
  // const { io } = useSocketIo();

  const form = useAppForm({
    validators: {
      onChange: formSchema,
    },
    defaultValues: {
      phoneNumberOrEmail: '',
      password: '',
    } as z.infer<typeof formSchema>,
    onSubmit: async ({ value }) => {
      try {
        const inputType = getInputType(value.phoneNumberOrEmail)
        if (inputType === 'email') {
          // 邮箱登录
          const { data, error } = await authClient.signIn.email(
            {
              email: value.phoneNumberOrEmail,
              password: value.password,
              rememberMe: true,
              // callbackURL: callbackUrl
            },
            {
              onRequest: () => {
                console.log('邮箱登录请求开始')
              },
              onResponse: () => {
                console.log('邮箱登录请求完成')
              },
              onSuccess: c => {
                console.log('邮箱登录成功')
                refetch() // 更新会话状态
                // console.log("如果已连接到 WebSocket 服务，发送已登录事件");
                // io?.emit("logged", c.data.user.id);
              },
              onError: ctx => {
                console.error('邮箱登录失败:', ctx.error)
                // 这里可以添加错误提示
              },
            },
          )
          if (error) {
            toastError(error, '登录失败')
            return
          }
        } else if (inputType === 'phone') {
          // 手机号登录
          const { data, error } = await authClient.signIn.phoneNumber(
            {
              phoneNumber: `+86${value.phoneNumberOrEmail}`,
              password: value.password,
              rememberMe: true,
            },
            {
              onRequest: () => {
                console.log('手机号登录请求开始')
              },
              onResponse: () => {
                console.log('手机号登录请求完成')
              },
              onSuccess: () => {
                console.log('手机号登录成功')
              },
              onError: ctx => {
                console.error('手机号登录失败:', ctx.error)
              },
            },
          )
          if (error) {
            if (error.code === 'INVALID_PHONE_NUMBER_OR_PASSWORD') {
              error.message = '手机号或密码错误'
            }
            toastError(error)
            return
          }
        } else {
          toastError('无效的登录方式')
        }
        router.push(callbackUrl)
      } catch (error) {
        toastError(error)
      }
    },
  })

  return (
    <>
      <form.AppForm>
        <form.Form className="space-y-3" onSubmit={form.handleSubmit}>
          {/* <Description>你所在的地区仅支持 手机号 \ 微信 \ 邮箱 登录</Description> */}
          <form.AppField name="phoneNumberOrEmail">
            {field => (
              <field.FieldInputGroup
                placeholder="请输入手机号\邮箱地址"
                Addon={<User2Icon />}
              />
            )}
          </form.AppField>
          <form.AppField name="password">
            {field => <field.InputPassword />}
          </form.AppField>
          <form.AppField name="isAgree">
            {field => (
              <field.FieldCheckbox
                label={
                  <>
                    已阅读并同意{' '}
                    <Link
                      href={'/legal/terms'}
                      className="text-accent-foreground underline"
                    >
                      用户协议
                    </Link>{' '}
                    与{' '}
                    <Link
                      href={'/legal/privacy'}
                      className="text-accent-foreground underline"
                    >
                      隐私政策
                    </Link>
                  </>
                }
              />
            )}
          </form.AppField>
          <form.SubmitButton className="w-full mt-6" label="登录" />
          {/* 

        <Controller
          name="isAgree"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="h-9">
              <div className="flex items-center gap-2 text-muted-foreground text-xs ">
                <Checkbox
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
                <FieldLabel className="text-xs">
                  
                </FieldLabel>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button pending={formState.isSubmitting} type="submit" className="w-full mt-6">
          登录
        </Button> */}
        </form.Form>
      </form.AppForm>
      <div className="w-full flex justify-between mt-3 text-sm">
        <Link href={'/forgot_password?callbackUrl=sign_in'}>忘记密码</Link>
        <Link href="/sign_up">立即注册</Link>
      </div>
    </>
  )
}
