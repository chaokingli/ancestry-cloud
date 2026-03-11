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
import Link from "next/link"
import { signIn } from "next-auth/react"

const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "请输入密码"),
})

type LoginSchema = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginSchema) {
    setIsLoading(true)
    setError(null)

    try {
      // 使用 NextAuth 的 signIn 方法
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // 不自动重定向，让我们能处理结果
      })

      if (result?.error) {
        setError("邮箱或密码错误")
        setIsLoading(false)
        return
      }

      // 登录成功，重定向到首页或其他页面
      router.push("/")
      router.refresh()
    } catch (error) {
      setError("登录失败，请稍后重试")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-paper-50 to-ink-50/30 px-4 py-12">
      <Card className="w-full max-w-md border-ink-200 shadow-lg ink-wash-card">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-vermilion-600 bg-vermilion-50 text-vermilion-600">
            <span className="font-serif text-3xl font-bold">祀</span>
          </div>
          <div className="space-y-2">
            <CardTitle className="font-serif text-2xl text-ink-900">登录账户</CardTitle>
            <CardDescription className="text-ink-600">
              使用您的邮箱和密码登录祖祀平台
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor="email" className="font-serif text-ink-900">
                      邮箱
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="font-mono"
                      disabled={isLoading}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor="password" className="font-serif text-ink-900">
                      密码
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="font-mono"
                      disabled={isLoading}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between text-sm">
                <Label className="flex items-center space-x-2 text-ink-600">
                  <input type="checkbox" className="rounded border-ink-300 text-ink-900 focus:ring-ink-500" />
                  <span>保持登录</span>
                </Label>
                <Link href="/forgot-password" className="font-medium text-vermilion-600 hover:text-vermilion-700">
                  忘记密码？
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-ink-900 hover:bg-ink-800 font-serif tracking-wide"
                disabled={isLoading}
              >
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ink-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-paper-100 px-2 text-ink-500">或使用其他方式</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full border-ink-200 hover:bg-ink-50">
              Google
            </Button>
            <Button variant="outline" className="w-full border-ink-200 hover:bg-ink-50">
              GitHub
            </Button>
          </div>

          <p className="text-center text-sm text-ink-600">
            还没有账户？{" "}
            <Link href="/register" className="font-medium text-vermilion-600 hover:text-vermilion-700">
              立即注册
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}