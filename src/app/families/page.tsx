"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Home,
  Users,
  Plus,
  ChevronLeft,
  Loader2,
  AlertCircle,
  User,
  Crown,
  Eye,
  ScrollText,
  Calendar,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib"

// Types
interface Family {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

interface FamilyMember {
  family: Family
  role: "ADMIN" | "EDITOR" | "VIEWER"
  joinedAt: string
}

const roleLabels: Record<string, { label: string; icon: typeof User; color: string }> = {
  ADMIN: { label: "管理员", icon: Crown, color: "text-vermilion-600" },
  EDITOR: { label: "编辑者", icon: User, color: "text-ink-600" },
  VIEWER: { label: "查看者", icon: Eye, color: "text-ink-400" },
}

export default function FamiliesPage() {
  const router = useRouter()

  // State
  const [families, setFamilies] = useState<FamilyMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create family modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newFamilyName, setNewFamilyName] = useState("")
  const [newFamilyDescription, setNewFamilyDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Check authentication via API
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/families", {
          credentials: "include",
        })
        if (res.status === 401) {
          router.push("/login")
          return
        }
        setIsAuthenticated(true)
      } catch {
        router.push("/login")
      }
    }
    checkAuth()
  }, [router])

  // Fetch families
  useEffect(() => {
    if (!isAuthenticated) return

    const fetchFamilies = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch("/api/families", {
          credentials: "include",
        })

        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login")
            return
          }
          throw new Error("获取家族列表失败")
        }

        const data = await res.json()
        setFamilies(data.families || [])
      } catch (err) {
        console.error("Error fetching families:", err)
        setError("加载家族列表时出错，请稍后重试")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFamilies()
  }, [isAuthenticated, router])

  // Handle create family
  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFamilyName.trim()) return

    setIsCreating(true)
    setCreateError(null)

    try {
      const res = await fetch("/api/families", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: newFamilyName.trim(),
          description: newFamilyDescription.trim() || null,
        }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login")
          return
        }
        const data = await res.json()
        throw new Error(data.message || "创建家族失败")
      }

      const data = await res.json()

      // Add new family to list
      setFamilies((prev) => [
        ...prev,
        {
          family: data.family,
          role: data.family.role || "EDITOR",
          joinedAt: new Date().toISOString(),
        },
      ])

      // Reset form and close modal
      setNewFamilyName("")
      setNewFamilyDescription("")
      setIsCreateModalOpen(false)
    } catch (err) {
      console.error("Error creating family:", err)
      setCreateError(err instanceof Error ? err.message : "创建家族失败")
    } finally {
      setIsCreating(false)
    }
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Loading state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-ink-400" />
          <p className="text-ink-600 font-serif">验证身份中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper-100">
      {/* Header */}
      <div className="border-b border-paper-400 bg-paper-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-ink-600 hover:text-ink-800 hover:bg-paper-200"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回
            </Button>
            <div className="h-4 w-px bg-paper-400" />
            <nav className="flex items-center gap-2 text-sm text-ink-500">
              <Link href="/" className="hover:text-ink-700">
                首页
              </Link>
              <span>/</span>
              <span className="text-ink-800">我的家族</span>
            </nav>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-ink-100 text-ink-700">
              <Home className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-ink-900">
              我的家族
            </h1>
          </div>
          <p className="text-ink-500 font-serif ml-13">
            管理您的家族，传承家族文化
          </p>
        </div>

        {/* Create Family Button */}
        <div className="mb-6">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-vermilion"
          >
            <Plus className="h-4 w-4 mr-2" />
            创建新家族
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="card-ink p-8 text-center mb-6">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-vermilion-500" />
            <h2 className="text-xl font-serif text-ink-800 mb-2">出错了</h2>
            <p className="text-ink-600 font-serif mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="btn-ink"
            >
              重试
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-ink-400 mb-4" />
            <p className="text-ink-600 font-serif">加载家族列表...</p>
          </div>
        )}

        {/* Families Grid */}
        {!isLoading && !error && (
          <>
            {families.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {families.map((familyMember) => {
                  const family = familyMember.family
                  const roleConfig = roleLabels[familyMember.role]
                  const RoleIcon = roleConfig.icon

                  return (
                    <Link
                      key={family.id}
                      href={`/families/${family.id}`}
                      className="group"
                    >
                      <Card className="card-ink-elevated overflow-hidden transition-all duration-300 hover:shadow-ink-xl h-full">
                        {/* Card Header */}
                        <CardHeader className="border-b border-paper-300 bg-paper-50/50 p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 text-ink-600 border-2 border-ink-200 group-hover:border-vermilion-400 group-hover:text-vermilion-600 transition-colors">
                              <Users className="h-7 w-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg font-serif text-ink-800 group-hover:text-vermilion-700 transition-colors truncate">
                                {family.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <RoleIcon className={cn("h-3.5 w-3.5", roleConfig.color)} />
                                <span className={cn("text-sm", roleConfig.color)}>
                                  {roleConfig.label}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        {/* Card Content */}
                        <CardContent className="p-4 space-y-3">
                          {/* Description */}
                          {family.description ? (
                            <p className="text-sm text-ink-600 line-clamp-2">
                              {family.description}
                            </p>
                          ) : (
                            <p className="text-sm text-ink-400 italic">
                              暂无描述
                            </p>
                          )}

                          {/* Divider */}
                          <div className="divider-ink my-3" />

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-xs text-ink-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>创建于 {formatDate(family.createdAt)}</span>
                            </div>
                            <span className="text-vermilion-600 font-medium group-hover:underline">
                              查看详情 →
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="card-ink p-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-ink-300" />
                <h2 className="text-xl font-serif text-ink-800 mb-2">
                  您还没有加入任何家族
                </h2>
                <p className="text-ink-500 font-serif mb-6">
                  创建一个新家族或等待其他家族成员邀请您加入
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-vermilion"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  创建家族
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Family Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md card-ink-elevated overflow-hidden">
            {/* Modal Header */}
            <div className="border-b border-paper-300 bg-paper-50/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-vermilion-100 text-vermilion-600">
                    <Plus className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-ink-900">
                    创建新家族
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreateModalOpen(false)
                    setCreateError(null)
                    setNewFamilyName("")
                    setNewFamilyDescription("")
                  }}
                  className="text-ink-400 hover:text-ink-600"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <form onSubmit={handleCreateFamily} className="space-y-4">
                {/* Family Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink-700 font-serif">
                    家族名称 <span className="text-vermilion-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="请输入家族名称"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    className="input-ink"
                    required
                    maxLength={50}
                  />
                </div>

                {/* Family Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink-700 font-serif">
                    家族描述
                  </label>
                  <textarea
                    placeholder="可选：描述家族的历史、起源等"
                    value={newFamilyDescription}
                    onChange={(e) => setNewFamilyDescription(e.target.value)}
                    className="input-ink min-h-[100px] resize-none"
                    maxLength={500}
                    rows={4}
                  />
                  <p className="text-xs text-ink-400 text-right">
                    {newFamilyDescription.length}/500
                  </p>
                </div>

                {/* Error Message */}
                {createError && (
                  <div className="flex items-center gap-2 text-sm text-vermilion-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{createError}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateModalOpen(false)
                      setCreateError(null)
                      setNewFamilyName("")
                      setNewFamilyDescription("")
                    }}
                    className="flex-1 btn-ink-outline"
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    disabled={!newFamilyName.trim() || isCreating}
                    className={cn(
                      "flex-1 btn-vermilion",
                      (!newFamilyName.trim() || isCreating) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        创建中...
                      </>
                    ) : (
                      "创建家族"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
