'use client'

import { Field } from '@/components/ui/field'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import {
  useModal,
  useAlert,
  useConfirm,
  usePrompt,
  useLoading,
  useSignOut,
} from '../../../../components/uix/modal/provider'
import {
  LogOut,
  AlertTriangle,
  MessageSquare,
  Loader2,
  Info,
  Trash2,
  Plus,
} from 'lucide-react'
import { authClient } from '@/modules/auth/client'
import { useSession } from '@/modules/auth/hook/query'

export function ModalExamples() {
  const modal = useModal()
  const showAlert = useAlert()
  const showConfirm = useConfirm()
  const showPrompt = usePrompt()
  const { showLoading, hideLoading, updateProgress } = useLoading()
  const showSignOut = useSignOut()
  const { refetch } = useSession()
  // 模拟异步操作
  const simulateAsyncOperation = async () => {
    showLoading('正在处理...', 0)

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      updateProgress(i)
    }

    hideLoading()
    showAlert('成功', '操作已完成！')
  }

  // 模拟删除操作
  const handleDelete = () => {
    showConfirm({
      title: '确认删除',
      description: '此操作将永久删除该项目，无法撤销。您确定要继续吗？',
      onConfirm: async () => {
        showLoading('正在删除...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        hideLoading()
        showAlert('删除成功', '项目已被永久删除。')
      },
      variant: 'destructive',
    })
  }

  // 模拟编辑操作
  const handleEdit = () => {
    showPrompt(
      '编辑项目名称',
      '请输入新的项目名称',
      async newName => {
        if (newName.length < 2) {
          throw new Error('项目名称至少需要2个字符')
        }
        showLoading('正在保存...')
        await new Promise(resolve => setTimeout(resolve, 1500))
        hideLoading()
        showAlert('保存成功', `项目名称已更新为："${newName}"`)
      },
      '我的项目',
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          全局模态框系统演示
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* 创建项目模态框 */}
          {/* <Button
            variant="default"
            onClick={() => showCreateProject()}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            创建项目
          </Button> */}

          {/* 警告模态框 */}
          <Button
            variant="outline"
            onClick={() => showAlert('提示信息', '这是一个简单的警告提示框。')}
            className="flex items-center gap-2"
          >
            <Info className="w-4 h-4" />
            显示提示
          </Button>

          {/* 确认模态框 */}
          <Button
            variant="outline"
            onClick={() =>
              showConfirm({
                title: '确认操作',
                description: '您确定要执行这个操作吗？',
                onConfirm: () => showAlert('已确认', '您选择了确认操作。'),
              })
            }
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            确认对话框
          </Button>

          {/* 输入提示框 */}
          <Button
            variant="outline"
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            输入对话框
          </Button>

          {/* 加载模态框 */}
          <Button
            variant="outline"
            onClick={simulateAsyncOperation}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4" />
            进度加载
          </Button>

          {/* 退出登录模态框 */}
          <Button
            variant="outline"
            onClick={() => showSignOut('用户名123')}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              showConfirm({
                title: (
                  <Field orientation="horizontal">
                    <LogOut className="text-destructive " />
                    确认退出登录
                  </Field>
                ),
                description: (
                  <>
                    您确定要退出
                    <span className="font-medium text-foreground mx-1">
                      {'用户名123'}
                    </span>
                    的账户吗？
                  </>
                ),
                onConfirm: () =>
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        refetch()
                        // router.push("/");
                        // 关闭模态框 是自动的
                      },
                      onError: ctx => {
                        console.error('Sign out error:', ctx.error)
                        throw new Error(ctx.error.message || '退出登录失败')
                      },
                    },
                  }),
              })
            }
            className="flex items-center gap-2"
          >
            <LogOut className="size-4" />
            退出登录
          </Button>

          {/* 删除确认 */}
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            删除项目
          </Button>
        </div>

        {/* 自定义模态框示例 */}
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-3">自定义模态框</h3>
          <Button
            variant="secondary"
            onClick={() =>
              modal.openModal('custom', {
                component: (
                  <Card className="border-0 shadow-none">
                    <CardHeader>
                      <CardTitle>自定义内容</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>这是一个完全自定义的模态框内容。</p>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={modal.closeModal}>
                          关闭
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ),
              })
            }
            className="flex items-center gap-2"
          >
            自定义模态框
          </Button>
        </div>

        {/* 使用说明 */}
        <div className="pt-4 border-t text-sm text-muted-foreground">
          <h4 className="font-medium mb-2">使用方法：</h4>
          <ul className="space-y-1 text-xs">
            <li>• 在组件中导入相应的 hook</li>
            <li>• 调用对应的方法显示模态框</li>
            <li>• 支持异步操作和错误处理</li>
            <li>• 自动管理打开/关闭状态</li>
            <li>• 复杂表单用自定义模态框组件</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
