"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

// Profile form schema
const profileSchema = z.object({
  name: z.string().min(1, "请输入姓名"),
  email: z.string().email("请输入有效的邮箱地址"),
  phone: z.string().optional(),
  bio: z.string().max(500, "个人简介最多500个字符").optional(),
})

type ProfileSchema = z.infer<typeof profileSchema>

// Password change schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "请输入当前密码"),
  newPassword: z.string().min(8, "密码至少需要8个字符").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+]{8,}$/,
    "密码必须包含大小写字母和数字"
  ),
  confirmPassword: z.string().min(1, "请确认密码"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
})

type PasswordSchema = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Profile form
  const profileForm = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bio: "",
    },
  })

  // Password form
  const passwordForm = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onProfileSubmit(data: ProfileSchema) {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Profile update:", data)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert("个人信息已更新")
    } catch (error) {
      setError("更新个人信息失败")
    } finally {
      setIsLoading(false)
    }
  }

  async function onPasswordSubmit(data: PasswordSchema) {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Password change:", data)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert("密码已修改")
      passwordForm.reset()
    } catch (error) {
      setError("修改密码失败")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper-50 to-ink-50/30 px-3 sm:px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
        <div className="text-center space-y-2 px-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">用户设置</h1>
          <p className="text-ink-600 text-sm sm:text-base">管理您的账户和个人信息</p>
        </div>

        <Card className="border-ink-200 shadow-lg ink-wash-card">
          <div className="border-b border-ink-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-3 sm:py-4 text-sm font-medium transition-colors ${
                  activeTab === "profile"
                    ? "border-b-2 border-ink-900 text-ink-900"
                    : "text-ink-500 hover:text-ink-700"
                }`}
              >
                个人信息
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`flex-1 py-3 sm:py-4 text-sm font-medium transition-colors ${
                  activeTab === "password"
                    ? "border-b-2 border-ink-900 text-ink-900"
                    : "text-ink-500 hover:text-ink-700"
                }`}
              >
                修改密码
              </button>
            </div>
          </div>

          <CardContent className="p-4 sm:p-6">
            {error && (
              <div className="mb-4 sm:mb-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            {activeTab === "profile" ? (
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4 sm:space-y-6">
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="name" className="font-serif text-ink-900 text-sm sm:text-base">
                            姓名
                          </Label>
                          <Input
                            id="name"
                            placeholder="您的姓名"
                            className="font-mono text-sm sm:text-base min-h-[2.75rem]"
                            disabled={isLoading}
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="email" className="font-serif text-ink-900 text-sm sm:text-base">
                            邮箱
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            className="font-mono text-sm sm:text-base min-h-[2.75rem]"
                            disabled={isLoading}
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="phone" className="font-serif text-ink-900 text-sm sm:text-base">
                            手机号码
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="您的手机号码"
                            className="font-mono text-sm sm:text-base min-h-[2.75rem]"
                            disabled={isLoading}
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="bio" className="font-serif text-ink-900 text-sm sm:text-base">
                            个人简介
                          </Label>
                          <textarea
                            id="bio"
                            rows={4}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="简单介绍一下自己..."
                            disabled={isLoading}
                            {...field}
                          />
                          <FormMessage />
                          <p className="text-xs text-ink-500">
                            {profileForm.watch("bio")?.length || 0}/500
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 sm:gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="btn-ink-outline min-h-[2.75rem] touch-manipulation px-4 sm:px-6"
                    >
                      取消
                    </Button>
                    <Button
                      type="submit"
                      className="bg-ink-900 hover:bg-ink-800 font-serif tracking-wide min-h-[2.75rem] touch-manipulation px-4 sm:px-6"
                      disabled={isLoading}
                    >
                      {isLoading ? "保存中..." : "保存信息"}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="currentPassword" className="font-serif text-ink-900 text-sm sm:text-base">
                            当前密码
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="••••••••"
                            className="font-mono text-sm sm:text-base min-h-[2.75rem]"
                            disabled={isLoading}
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="newPassword" className="font-serif text-ink-900 text-sm sm:text-base">
                            新密码
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="••••••••"
                            className="font-mono text-sm sm:text-base min-h-[2.75rem]"
                            disabled={isLoading}
                            {...field}
                          />
                          <FormMessage />
                          <p className="text-xs text-ink-500">
                            密码至少8个字符，包含大小写字母和数字
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor="confirmPassword" className="font-serif text-ink-900 text-sm sm:text-base">
                            确认新密码
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="font-mono text-sm sm:text-base min-h-[2.75rem]"
                            disabled={isLoading}
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 sm:gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("profile")}
                      className="btn-ink-outline min-h-[2.75rem] touch-manipulation px-4 sm:px-6"
                    >
                      取消
                    </Button>
                    <Button
                      type="submit"
                      className="bg-ink-900 hover:bg-ink-800 font-serif tracking-wide min-h-[2.75rem] touch-manipulation px-4 sm:px-6"
                      disabled={isLoading}
                    >
                      {isLoading ? "修改中..." : "修改密码"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card className="border-ink-200 shadow-lg ink-wash-card">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="font-serif text-ink-900 text-lg sm:text-xl">账户偏好</CardTitle>
            <CardDescription className="text-ink-600 text-sm">
              管理您的账户偏好设置
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <Label className="font-serif text-ink-900 text-sm sm:text-base">邮件通知</Label>
                <p className="text-xs sm:text-sm text-ink-500">接收系统通知和更新</p>
              </div>
              <Checkbox defaultChecked className="data-[state=checked]:bg-ink-900 flex-shrink-0 h-5 w-5" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <Label className="font-serif text-ink-900 text-sm sm:text-base">隐私模式</Label>
                <p className="text-xs sm:text-sm text-ink-500">隐藏您的在线状态</p>
              </div>
              <Checkbox className="data-[state=checked]:bg-ink-900 flex-shrink-0 h-5 w-5" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <Label className="font-serif text-ink-900 text-sm sm:text-base">自动保存</Label>
                <p className="text-xs sm:text-sm text-ink-500">自动保存草稿和更改</p>
              </div>
              <Checkbox defaultChecked className="data-[state=checked]:bg-ink-900 flex-shrink-0 h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
