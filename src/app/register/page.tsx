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
import Link from "next/link"

const registerSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  name: z.string().min(1, "请输入姓名"),
  password: z.string().min(8, "密码至少需要8个字符").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+]{8,}$/,
    "密码必须包含大小写字母和数字"
  ),
  confirmPassword: z.string().min(1, "请确认密码"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "您必须同意服务条款才能注册",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
})

type RegisterSchema = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  })

  async function onSubmit(data: RegisterSchema) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || "注册失败，请稍后重试")
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/login?registered=true")
      }, 2000)
    } catch (error) {
      setError("注册失败，请稍后重试")
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
            <CardTitle className="font-serif text-2xl text-ink-900">创建账户</CardTitle>
            <CardDescription className="text-ink-600">
              加入祖祀平台，守护您的家族记忆
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-2 font-serif text-xl text-ink-900">注册成功！</h3>
              <p className="text-ink-600">正在跳转到登录页面...</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="name" className="font-serif text-ink-900">
                        姓名
                      </Label>
                      <Input
                        id="name"
                        placeholder="您的姓名"
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

                <div className="space-y-3">
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
                        <p className="text-xs text-ink-500">
                          密码至少8个字符，包含大小写字母和数字
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <Label htmlFor="confirmPassword" className="font-serif text-ink-900">
                          确认密码
                        </Label>
                        <Input
                          id="confirmPassword"
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
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <Checkbox
                          id="agreeToTerms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                          className="mt-1"
                        />
                        <div className="space-y-1 leading-none">
                          <Label
                            htmlFor="agreeToTerms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            我已阅读并同意{" "}
                            <Link href="/terms" className="text-vermilion-600 hover:underline">
              服务条款
            </Link>
                          </Label>
                          <p className="text-xs text-ink-500">
                            您的个人信息将按照我们的隐私政策进行处理
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-ink-900 hover:bg-ink-800 font-serif tracking-wide"
                  disabled={isLoading}
                >
                  {isLoading ? "注册中..." : "立即注册"}
                </Button>
              </form>
            </Form>
          )}

          <p className="text-center text-sm text-ink-600">
            已有账户？{" "}
            <Link href="/login" className="font-medium text-vermilion-600 hover:text-vermilion-700">
              立即登录
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
