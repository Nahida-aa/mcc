import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import z from 'zod'
import { OTPSchema, passwordSchema, phoneSchema } from '@/modules/auth/type'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
import { useCountdown } from 'usehooks-ts'
import { authClient } from '@/modules/auth/client'
import { toastError } from '@/components/uix/toast'
// import { FormField } from '@/app/a/ui/form/FormField'
import { Field, FieldDescription, FieldError } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Hash, Smartphone } from 'lucide-react'
// import { InputPassword } from '@/app/(main)/@modal/_comp/InputPassword'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAppForm } from '@/hooks/useAppForm'

const formSchema = z
  .object({
    phoneNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, '请确认密码'),
    code: OTPSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })
type Data = z.infer<typeof formSchema>
// forget
export function ForgotPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/'
  const form =
    useAppForm({
      validators: {
        onChange: formSchema,
      },
      defaultValues: {} as z.infer<typeof formSchema>,
      onSubmit: async ({ value }) => {
        const { data, error } = await authClient.phoneNumber.resetPassword({
          otp: value.code,
          phoneNumber: `+86${value.phoneNumber}`,
          newPassword: value.password,
        })
        if (error) {
          toastError(error)
          return
        }
        toast.success('密码重置成功')
        router.push(callbackUrl)
      }
    })
  // useCountdown 配置：初始 60s，成功发送后启动
  const [sending, setSending] = useState(false)
  const [count, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    intervalMs: 1000,
  })
  useEffect(() => {
    if (count === 0) setSending(false)
  }, [count])
  const onSubmit = async (fd: Data) => {
    const { data, error } = await authClient.phoneNumber.resetPassword({
      otp: fd.code,
      phoneNumber: `+86${fd.phoneNumber}`,
      newPassword: fd.password,
    })
    if (error) {
      toastError(error)
      return
    }
    toast.success('密码重置成功')
    router.push(callbackUrl)
  }
  const onSendPhoneOtp = async () => {
    if (sending) return // 避免重复发送
    const isValid = await form.validateField('phoneNumber', 'change')
    console.log("await form.validateField('phoneNumber', 'change')", isValid)
    const errLen = form.getFieldMeta('phoneNumber')?.errors.length
    const hasErrors = errLen ? errLen > 0 : false
    if (!isValid) {
      // 可选: toast 错误或聚焦字段
      // form.setFocus('phoneNumber')
      // toast.error("手机号格式无效");
      return // 验证失败，停止发送
    }
    resetCountdown()
    setSending(true)
    startCountdown()
    const { data, error } = await authClient.phoneNumber.requestPasswordReset({
      phoneNumber: `+86${form.getFieldValue('phoneNumber')}`,
    })
    if (error) {
      toastError(error)
      setSending(false)
      return
    }
  }
  return (<form.AppForm>

    <form.Form className="space-y-3" onSubmit={form.handleSubmit}>
      <form.AppField name="phoneNumber">
        {field => (
          <field.FieldInputGroup
            placeholder="请输入手机号"
            Addon={
              <>
                <Smartphone />
                <InputGroupText>+86</InputGroupText>
              </>
            }
          />
        )}
      </form.AppField>
      <form.AppField name="password">
        {field => <field.InputPassword />}
      </form.AppField>
      <form.AppField name="confirmPassword">
        {field => <field.InputPassword placeholder='请再次输入密码' />}
      </form.AppField>

      <div className="flex gap-2">
        <form.AppField name="code">
          {field => (
            <field.FieldInputGroup
              placeholder="请输入验证码"
              Addon={<Hash />}
              description="5分钟内有效, 60秒可重新发送"
            />
          )}
        </form.AppField>
        <Button
          className="w-25"
          type="button"
          variant="secondary"
          disabled={sending}
          onClick={() => onSendPhoneOtp()}
        >
          {sending ? `${count} 秒后重发` : '发送验证码'}
        </Button>
      </div>
      <form.SubmitButton className="w-full mt-6" label="重置密码" />

    </form.Form>
  </form.AppForm>
  )
}
