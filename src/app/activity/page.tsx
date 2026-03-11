"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  Flame,
  ScrollText,
  ImageIcon,
  Loader2,
  AlertCircle,
  Filter,
} from "lucide-react"
import { cn } from "@/lib"
import { Badge } from "@/components/ui/badge"

// Types
interface User {
  id: string
  name: string | null
  email: string
}

interface Ancestor {
  id: string
  firstName: string
  lastName: string | null
}

interface Family {
  id: string
  name: string
}

interface Activity {
  id: string
  familyId: string
  ancestorId: string | null
  type: string
  itemId: string | null
  itemName: string | null
  description: string
  createdAt: string
  user: User
  ancestor: Ancestor | null
  family: Family
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface FamilyMember {
  family: Family
  role: string
}

const TYPE_LABELS: Record<string, string> = {
  ancestor_created: "先祖创建",
  ancestor_updated: "先祖更新",
  ancestor_deleted: "先祖删除",
  ancestor_photo_added: "照片添加",
  ancestor_photo_deleted: "照片删除",
  eulogy_created: "祭文创建",
  eulogy_updated: "祭文更新",
  eulogy_deleted: "祭文删除",
  worship_record_created: "祭拜记录",
  worship_record_updated: "祭拜更新",
  worship_record_deleted: "祭拜删除",
  photo_album_created: "相册创建",
  photo_album_updated: "相册更新",
  photo_album_deleted: "相册删除",
  member_joined: "成员加入",
  member_left: "成员离开",
  family_created: "家族创建",
  family_updated: "家族更新",
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  ancestor_created: User,
  ancestor_updated: User,
  ancestor_deleted: User,
  ancestor_photo_added: ImageIcon,
  ancestor_photo_deleted: ImageIcon,
  eulogy_created: ScrollText,
  eulogy_updated: ScrollText,
  eulogy_deleted: ScrollText,
  worship_record_created: Flame,
  worship_record_updated: Flame,
  worship_record_deleted: Flame,
  photo_album_created: ImageIcon,
  photo_album_updated: ImageIcon,
  photo_album_deleted: ImageIcon,
  member_joined: User,
  member_left: User,
  family_created: User,
  family_updated: User,
}

function ActivityContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // State
  const [activities, setActivities] = useState<Activity[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [families, setFamilies] = useState<FamilyMember[]>([])
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize from URL params
  useEffect(() => {
    const familyId = searchParams.get("familyId") || ""
    const type = searchParams.get("type") || ""
    const page = parseInt(searchParams.get("page") || "1")

    setSelectedFamilyId(familyId)
    setSelectedType(type)
    setPagination((prev) => ({ ...prev, page }))
  }, [searchParams])

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
        const res = await fetch("/api/families", {
          credentials: "include",
        })

        if (res.ok) {
          const data = await res.json()
          setFamilies(data.families || [])

          if (data.families?.length > 0 && !selectedFamilyId) {
            setSelectedFamilyId(data.families[0].family.id)
          }
        }
      } catch (err) {
        console.error("Error fetching families:", err)
      }
    }

    fetchFamilies()
  }, [isAuthenticated, selectedFamilyId])

  // Fetch activities
  const fetchActivities = useCallback(async () => {
    if (!isAuthenticated || !selectedFamilyId) return

    try {
      setIsLoading(true)
      setError(null)

      const queryParams = new URLSearchParams({
        familyId: selectedFamilyId,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (selectedType) {
        queryParams.append("type", selectedType)
      }

      const res = await fetch(`/api/activity?${queryParams}`, {
        credentials: "include",
      })

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login")
          return
        }
        if (res.status === 403) {
          setError("您没有权限查看此家族的活动动态")
          return
        }
        throw new Error("获取活动动态失败")
      }

      const data = await res.json()
      setActivities(data.activities || [])
      setPagination(data.pagination)
    } catch (err) {
      console.error("Error fetching activities:", err)
      setError("加载活动动态时出错，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, selectedFamilyId, pagination.page, selectedType, router])

  // Fetch activities when dependencies change
  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  // Update URL with current filters
  const updateUrl = useCallback(
    (updates: Partial<{ familyId: string; type: string; page: number }>) => {
      const params = new URLSearchParams(searchParams)

      if (updates.familyId !== undefined) {
        if (updates.familyId) params.set("familyId", updates.familyId)
        else params.delete("familyId")
      }
      if (updates.type !== undefined) {
        if (updates.type) params.set("type", updates.type)
        else params.delete("type")
      }
      if (updates.page !== undefined) {
        if (updates.page > 1) params.set("page", updates.page.toString())
        else params.delete("page")
      }

      router.push(`/activity?${params.toString()}`)
    },
    [searchParams, router]
  )

  // Handle family change
  const handleFamilyChange = (familyId: string) => {
    setSelectedFamilyId(familyId)
    updateUrl({ familyId, page: 1 })
  }

  // Handle type filter change
  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    updateUrl({ type, page: 1 })
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    updateUrl({ page: newPage })
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get activity type label
  const getTypeLabel = (type: string) => {
    return TYPE_LABELS[type] || type
  }

  // Get activity type icon
  const getTypeIcon = (type: string) => {
    const Icon = TYPE_ICONS[type] || User
    return Icon
  }

  // Get activity description
  const getActivityDescription = (activity: Activity) => {
    if (!activity.ancestor) {
      return activity.description
    }

    const ancestorName = `${activity.ancestor.firstName}${activity.ancestor.lastName || ""}`

    switch (activity.type) {
      case "ancestor_created":
        return `创建了先祖信息: ${ancestorName}`
      case "ancestor_updated":
        return `更新了先祖信息: ${ancestorName}`
      case "ancestor_deleted":
        return `删除了先祖信息: ${ancestorName}`
      case "ancestor_photo_added":
        return `为 ${ancestorName} 添加了照片`
      case "ancestor_photo_deleted":
        return `从 ${ancestorName} 删除了照片`
      case "eulogy_created":
        return `为 ${ancestorName} 创建了祭文`
      case "eulogy_updated":
        return `更新了 ${ancestorName} 的祭文`
      case "eulogy_deleted":
        return `删除了 ${ancestorName} 的祭文`
      case "worship_record_created":
        return `为 ${ancestorName} 记录了祭拜`
      case "worship_record_updated":
        return `更新了 ${ancestorName} 的祭拜记录`
      case "worship_record_deleted":
        return `删除了 ${ancestorName} 的祭拜记录`
      case "photo_album_created":
        return `创建了相册`
      case "photo_album_updated":
        return `更新了相册`
      case "photo_album_deleted":
        return `删除了相册`
      case "member_joined":
        return `新成员加入家族`
      case "member_left":
        return `成员离开家族`
      case "family_created":
        return `创建了新家族`
      case "family_updated":
        return `更新了家族信息`
      default:
        return activity.description
    }
  }

  // Filter options
  const filterOptions = [
    { value: "", label: "全部动态" },
    { value: "ancestor_created", label: "先祖创建" },
    { value: "ancestor_updated", label: "先祖更新" },
    { value: "ancestor_deleted", label: "先祖删除" },
    { value: "eulogy_created", label: "祭文创建" },
    { value: "worship_record_created", label: "祭拜记录" },
    { value: "photo_album_created", label: "相册创建" },
  ]

  // Loading state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-ink-400" />
          <p className="text-ink-600 font-serif">加载中...</p>
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
              <span className="text-ink-800">活动动态</span>
            </nav>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-ink-100 text-ink-700">
              <Calendar className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-ink-900">
              活动动态
            </h1>
          </div>
          <p className="text-ink-500 font-serif ml-13">
            查看家族成员的活动动态和历史记录
          </p>
        </div>

        {/* Filters Bar */}
        <Card className="card-ink mb-6">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Family Selector */}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-ink-400 flex-shrink-0" />
                <select
                  value={selectedFamilyId}
                  onChange={(e) => handleFamilyChange(e.target.value)}
                  className="input-ink w-full sm:w-48 text-sm"
                >
                  <option value="">选择家族</option>
                  {families.map((fm) => (
                    <option key={fm.family.id} value={fm.family.id}>
                      {fm.family.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-ink-400 flex-shrink-0" />
                <select
                  value={selectedType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="input-ink w-full sm:w-64 text-sm"
                >
                  {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <div className="card-ink p-8 text-center mb-6">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-vermilion-500" />
            <h2 className="text-xl font-serif text-ink-800 mb-2">出错了</h2>
            <p className="text-ink-600 font-serif mb-6">{error}</p>
            <Button onClick={fetchActivities} className="btn-ink">
              重试
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-ink-400 mb-4" />
            <p className="text-ink-600 font-serif">加载活动动态...</p>
          </div>
        )}

        {/* No Family Selected */}
        {!isLoading && !error && !selectedFamilyId && (
          <div className="card-ink p-12 text-center">
            <User className="h-16 w-16 mx-auto mb-4 text-ink-300" />
            <h2 className="text-xl font-serif text-ink-800 mb-2">请先选择家族</h2>
            <p className="text-ink-500 font-serif mb-6">
              选择上方的家族以查看该家族的活动动态
            </p>
            <Link href="/families" className="btn-ink">
              <span className="mr-2">+</span>
              创建或加入家族
            </Link>
          </div>
        )}

        {/* Activity Feed */}
        {!isLoading && !error && selectedFamilyId && (
          <>
            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-ink-500">
                共 <span className="font-medium text-ink-700">{pagination.total}</span> 条动态
                {selectedType && (
                  <span className="ml-2">
                    (类型: &quot;{getTypeLabel(selectedType)}&quot;)
                  </span>
                )}
              </p>
              <p className="text-sm text-ink-400">
                第 {pagination.page} / {pagination.totalPages} 页
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line - Hidden on mobile, shown on sm+ */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-ink-200 via-ink-300 to-ink-200 sm:left-8 hidden sm:block" />

              {activities.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {activities.map((activity, index) => {
                    const Icon = getTypeIcon(activity.type)
                    const isLast = index === activities.length - 1

                    return (
                      <div key={activity.id} className="relative pl-14 sm:pl-20 md:pl-24">
                        {/* Timeline Node */}
                        <div className="absolute left-0 sm:left-4 top-0 flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16">
                          <div className="relative flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-paper-50 border-2 border-ink-200 text-ink-600 shadow-sm z-10">
                            <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                            {/* Timeline Node Connector (Desktop) */}
                            {!isLast && (
                              <div className="absolute bottom-0 left-1/2 w-px h-2 bg-gradient-to-b from-ink-200 to-ink-300 -translate-x-1/2 hidden sm:block" />
                            )}
                          </div>
                        </div>

                        {/* Activity Card */}
                        <Card className="card-ink-elevated hover:shadow-ink-lg transition-shadow">
                          <CardHeader className="pb-3 px-3 sm:px-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-sm sm:text-base font-serif text-ink-800 flex items-center gap-2 flex-wrap">
                                  <span className="truncate">{activity.user.name || activity.user.email}</span>
                                  <Badge variant="secondary" className="text-xs whitespace-nowrap">
                                    {activity.family.name}
                                  </Badge>
                                </CardTitle>
                                <div className="mt-2 space-y-1">
                                  <p className="font-serif text-sm text-ink-700 break-words">
                                    {getActivityDescription(activity)}
                                  </p>
                                  {activity.ancestor && (
                                    <p className="font-serif text-xs text-ink-400">
                                      先祖: {activity.ancestor.firstName}
                                      {activity.ancestor.lastName || ""}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                                <span className="inline-flex items-center gap-1 text-xs text-ink-400 whitespace-nowrap">
                                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span className="hidden sm:inline">{formatDate(activity.createdAt)}</span>
                                  <span className="sm:hidden">{new Date(activity.createdAt).toLocaleDateString('zh-CN')}</span>
                                </span>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs whitespace-nowrap",
                                    activity.type.includes("deleted")
                                      ? "text-ink-500 border-ink-200"
                                      : "text-vermilion-600 border-vermilion-200 bg-vermilion-50"
                                  )}
                                >
                                  {getTypeLabel(activity.type)}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="card-ink p-12 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-ink-300" />
                  <h2 className="text-xl font-serif text-ink-800 mb-2">
                    {selectedType ? "暂无该类型动态" : "暂无活动动态"}
                  </h2>
                  <p className="text-ink-500 font-serif mb-6">
                    {selectedType
                      ? `${getTypeLabel(selectedType)}类型暂无相关记录`
                      : "该家族还没有任何活动记录"}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedType("")
                      updateUrl({ type: "" })
                    }}
                    className="btn-ink-outline"
                  >
                    清除筛选
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {activities.length > 0 && pagination.totalPages > 1 && (
              <div className="mt-6 sm:mt-8 flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className={cn(
                    "btn-ink-outline min-h-[2.5rem] min-w-[2.5rem] touch-manipulation",
                    pagination.page <= 1 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ChevronLeft className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">上一页</span>
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first, last, current, and pages around current
                      // On mobile, show fewer pages
                      const range = typeof window !== 'undefined' && window.innerWidth < 640 ? 0 : 1
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.page) <= range
                      )
                    })
                    .map((page, index, array) => {
                      const showEllipsis = index > 0 && array[index - 1] !== page - 1

                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsis && (
                            <span className="px-1 sm:px-2 text-ink-400">...</span>
                          )}
                          <Button
                            variant={pagination.page === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={cn(
                              "min-w-[2rem] sm:min-w-[2.5rem] min-h-[2.5rem] touch-manipulation",
                              pagination.page === page
                                ? "btn-ink"
                                : "btn-ink-outline hover:bg-paper-200"
                            )}
                          >
                            {page}
                          </Button>
                        </div>
                      )
                    })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className={cn(
                    "btn-ink-outline min-h-[2.5rem] min-w-[2.5rem] touch-manipulation",
                    pagination.page >= pagination.totalPages &&
                      "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="hidden sm:inline">下一页</span>
                  <ChevronRight className="h-4 w-4 sm:ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

// Page with Suspense boundary for useSearchParams
export default function ActivityPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper-100 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-ink-400" />
        </div>
      }
    >
      <ActivityContent />
    </Suspense>
  )
}
