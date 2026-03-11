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
import { ArrowLeft, Loader2 } from "lucide-react"

const ancestorSchema = z.object({
  firstName: z.string().min(1, "请输入名字"),
  lastName: z.string().optional(),
  gender: z.enum(["男", "女", "其他"]).optional(),


  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  birthPlace: z.string().optional(),
  deathPlace: z.string().optional(),
  bio: z.string().optional(),
})

type AncestorSchema = z.infer<typeof ancestorSchema>

export default function NewAncestorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<AncestorSchema>({
    resolver: zodResolver(ancestorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      birthDate: "",
      deathDate: "",
      birthPlace: "",
      deathPlace: "",
      bio: "",
    },
  })

  async function onSubmit(data: AncestorSchema) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/ancestors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          familyId: params.id,
          firstName: data.firstName,
          lastName: data.lastName || undefined,
          gender: data.gender,
          birthDate: data.birthDate || undefined,
          deathDate: data.deathDate || undefined,
          birthPlace: data.birthPlace || undefined,
          deathPlace: data.deathPlace || undefined,
          bio: data.bio || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "创建先祖信息失败")
      }

      setSuccess(`已成功创建先祖: ${data.firstName}${data.lastName || ""}`)

      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/families/${params.id}`)
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建先祖信息失败，请稍后重试")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper-50 to-ink-50/30 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href={`/families/${params.id}`}
            className="inline-flex items-center text-ink-600 hover:text-ink-900 font-serif transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回家族
          </Link>
        </div>

        <Card className="border-ink-200 shadow-lg ink-wash-card">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-vermilion-600 bg-vermilion-50 text-vermilion-600">
              <span className="font-serif text-2xl font-bold">祀</span>
            </div>
            <div className="space-y-2">
              <CardTitle className="font-serif text-2xl text-ink-900">添加先祖</CardTitle>
              <CardDescription className="text-ink-600">
                填写先祖的基本信息，记录家族历史
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                {success}
              </div>
            )}

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <Label htmlFor="lastName" className="font-serif text-ink-900">
                          姓氏
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="如：张"
                          className="font-serif"
                          disabled={isLoading}
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <Label htmlFor="firstName" className="font-serif text-ink-900">
                          名字 <span className="text-vermilion-600">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="如：三"
                          className="font-serif"
                          disabled={isLoading}
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label className="font-serif text-ink-900">
                        性别 <span className="text-vermilion-600">*</span>
                      </Label>
                      <div className="flex gap-4">
                        {["男", "女", "其他"].map((gender) => (
                          <label
                            key={gender}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md border cursor-pointer transition-colors ${
                              field.value === gender
                                ? "border-vermilion-600 bg-vermilion-50 text-vermilion-700"
                                : "border-ink-200 hover:bg-ink-50"
                            }`}
                          >
                            <input
                              type="radio"
                              value={gender}
                              checked={field.value === gender}
                              onChange={(e) => field.onChange(e.target.value)}
                              disabled={isLoading}
                              className="sr-only"
                            />
                            <span className="font-serif">{gender}</span>
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <Label htmlFor="birthDate" className="font-serif text-ink-900">
                          出生日期
                        </Label>
                        <Input
                          id="birthDate"
                          type="date"
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
                    name="deathDate"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <Label htmlFor="deathDate" className="font-serif text-ink-900">
                          逝世日期
                        </Label>
                        <Input
                          id="deathDate"
                          type="date"
                          className="font-mono"
                          disabled={isLoading}
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Places */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="birthPlace"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <Label htmlFor="birthPlace" className="font-serif text-ink-900">
                          出生地点
                        </Label>
                        <Input
                          id="birthPlace"
                          placeholder="如：北京市"
                          className="font-serif"
                          disabled={isLoading}
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deathPlace"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <Label htmlFor="deathPlace" className="font-serif text-ink-900">
                          逝世地点
                        </Label>
                        <Input
                          id="deathPlace"
                          placeholder="如：上海市"
                          className="font-serif"
                          disabled={isLoading}
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="bio" className="font-serif text-ink-900">
                        生平简介
                      </Label>
                      <textarea
                        id="bio"
                        placeholder="请输入先祖的生平事迹、贡献或其他重要信息..."
                        rows={4}
                        className="w-full px-3 py-2 border border-ink-200 rounded-md font-serif text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-ink-500 focus:border-transparent disabled:opacity-50 resize-none"
                        disabled={isLoading}
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-ink-200 hover:bg-ink-50 font-serif"
                    disabled={isLoading}
                    onClick={() => router.push(`/families/${params.id}`)}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-ink-900 hover:bg-ink-800 font-serif tracking-wide"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        创建中...
                      </>
                    ) : (
                      "创建先祖"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
