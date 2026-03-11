"use client"
import { useEffect, useState, useCallback, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  MapPin,
  Flame,
  ImageIcon,
  ScrollText,
  Filter,
  ArrowUpDown,
  Loader2,
  AlertCircle,
  Users,
  Plus,
} from "lucide-react"
import { cn } from "@/lib"

// Types
interface Ancestor {
  id: string
  firstName: string
  lastName: string | null
  gender: string
  birthDate: string | null
  deathDate: string | null
  birthPlace: string | null
  deathPlace: string | null
  bio: string | null
  familyId: string
  createdAt: string
  updatedAt: string
  _count?: {
    photos: number
    eulogies: number
    worshipRecords: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Family {
  id: string
  name: string
  description: string | null
}

interface FamilyMember {
  family: Family
  role: string
}

type SortField = "createdAt" | "firstName" | "birthDate" | "deathDate"
type SortOrder = "asc" | "desc"

function AncestorsListPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [ancestors, setAncestors] = useState<Ancestor[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })
  const [families, setFamilies] = useState<FamilyMember[]>([])
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortField>("createdAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize from URL params
  useEffect(() => {
    const familyId = searchParams.get("familyId") || ""
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const sort = (searchParams.get("sortBy") as SortField) || "createdAt"
    const order = (searchParams.get("sortOrder") as SortOrder) || "desc"

    setSelectedFamilyId(familyId)
    setSearchQuery(search)
    setPagination((prev) => ({ ...prev, page }))
    setSortBy(sort)
    setSortOrder(order)
  }, [searchParams])

  // Check authentication via API
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to fetch families to check if user is authenticated
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

          // Auto-select first family if none selected
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

  // Fetch ancestors
  const fetchAncestors = useCallback(async () => {
    if (!isAuthenticated || !selectedFamilyId) return

    try {
      setIsLoading(true)
      setError(null)

      const queryParams = new URLSearchParams({
        familyId: selectedFamilyId,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder,
      })

      if (searchQuery) {
        queryParams.append("search", searchQuery)
      }

      const res = await fetch(`/api/ancestors?${queryParams}`, {
        credentials: "include",
      })

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login")
          return
        }
        if (res.status === 403) {
          setError("您没有权限查看此家族的先祖信息")
          return
        }
        throw new Error("获取先祖列表失败")
      }

      const data = await res.json()
      setAncestors(data.ancestors || [])
      setPagination(data.pagination)
    } catch (err) {
      console.error("Error fetching ancestors:", err)
      setError("加载先祖列表时出错，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, selectedFamilyId, pagination.page, pagination.limit, sortBy, sortOrder, searchQuery, router])

  // Fetch ancestors when dependencies change
  useEffect(() => {
    fetchAncestors()
  }, [fetchAncestors])

  // Update URL with current filters
  const updateUrl = useCallback(
    (updates: Partial<{ familyId: string; search: string; page: number; sortBy: SortField; sortOrder: SortOrder }>) => {
      const params = new URLSearchParams(searchParams)

      if (updates.familyId !== undefined) {
        if (updates.familyId) params.set("familyId", updates.familyId)
        else params.delete("familyId")
      }
      if (updates.search !== undefined) {
        if (updates.search) params.set("search", updates.search)
        else params.delete("search")
      }
      if (updates.page !== undefined) {
        if (updates.page > 1) params.set("page", updates.page.toString())
        else params.delete("page")
      }
      if (updates.sortBy !== undefined) {
        params.set("sortBy", updates.sortBy)
      }
      if (updates.sortOrder !== undefined) {
        params.set("sortOrder", updates.sortOrder)
      }

      router.push(`/ancestors?${params.toString()}`)
    },
    [searchParams, router]
  )

  // Handle family change
  const handleFamilyChange = (familyId: string) => {
    setSelectedFamilyId(familyId)
    updateUrl({ familyId, page: 1 })
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl({ search: searchQuery, page: 1 })
  }

  // Handle sort
  const handleSort = (field: SortField) => {
    const newOrder = sortBy === field && sortOrder === "desc" ? "asc" : "desc"
    setSortBy(field)
    setSortOrder(newOrder)
    updateUrl({ sortBy: field, sortOrder: newOrder })
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    updateUrl({ page: newPage })
  }

  // Format date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "未知"
    const date = new Date(dateStr)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Calculate age
  const calculateAge = (ancestor: Ancestor) => {
    if (!ancestor.birthDate) return null
    const birth = new Date(ancestor.birthDate)
    const end = ancestor.deathDate ? new Date(ancestor.deathDate) : new Date()
    const age = end.getFullYear() - birth.getFullYear()
    return age > 0 ? age : null
  }

  // Get full name
  const getFullName = (ancestor: Ancestor) => {
    return `${ancestor.firstName}${ancestor.lastName || ""}`
  }

  // Get sort label
  const getSortLabel = (field: SortField) => {
    const labels: Record<SortField, string> = {
      createdAt: "创建时间",
      firstName: "姓名",
      birthDate: "出生日期",
      deathDate: "离世日期",
    }
    return labels[field]
  }

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
              <span className="text-ink-800">先祖列表</span>
            </nav>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-ink-100 text-ink-700">
              <Users className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-ink-900">
              先祖谱系
            </h1>
          </div>
          <p className="text-ink-500 font-serif ml-13">
            追溯家族根源，缅怀历代先祖
          </p>
        </div>

        {/* Filters Bar */}
        <Card className="card-ink mb-6">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Family Selector */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-ink-400 flex-shrink-0" />
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

              {/* Search and Sort */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                {/* Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <Input
                    type="text"
                    placeholder="搜索先祖姓名..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-ink pl-10 w-full sm:w-64 text-sm"
                  />
                </form>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-ink-400 flex-shrink-0" />
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split("-") as [SortField, SortOrder]
                      setSortBy(field)
                      setSortOrder(order)
                      updateUrl({ sortBy: field, sortOrder: order })
                    }}
                    className="input-ink w-full sm:w-40 text-sm"
                  >
                    <option value="createdAt-desc">最新创建</option>
                    <option value="createdAt-asc">最早创建</option>
                    <option value="firstName-asc">姓名 (A-Z)</option>
                    <option value="firstName-desc">姓名 (Z-A)</option>
                    <option value="birthDate-asc">出生日期 (早)</option>
                    <option value="birthDate-desc">出生日期 (晚)</option>
                    <option value="deathDate-asc">离世日期 (早)</option>
                    <option value="deathDate-desc">离世日期 (晚)</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-ink mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Family Selector */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-ink-400" />
                <select
                  value={selectedFamilyId}
                  onChange={(e) => handleFamilyChange(e.target.value)}
                  className="input-ink w-full sm:w-48"
                >
                  <option value="">选择家族</option>
                  {families.map((fm) => (
                    <option key={fm.family.id} value={fm.family.id}>
                      {fm.family.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search and Sort */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <Input
                    type="text"
                    placeholder="搜索先祖姓名..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-ink pl-10 w-full sm:w-64"
                  />
                </form>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-ink-400" />
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split("-") as [SortField, SortOrder]
                      setSortBy(field)
                      setSortOrder(order)
                      updateUrl({ sortBy: field, sortOrder: order })
                    }}
                    className="input-ink w-full sm:w-40"
                  >
                    <option value="createdAt-desc">最新创建</option>
                    <option value="createdAt-asc">最早创建</option>
                    <option value="firstName-asc">姓名 (A-Z)</option>
                    <option value="firstName-desc">姓名 (Z-A)</option>
                    <option value="birthDate-asc">出生日期 (早)</option>
                    <option value="birthDate-desc">出生日期 (晚)</option>
                    <option value="deathDate-asc">离世日期 (早)</option>
                    <option value="deathDate-desc">离世日期 (晚)</option>
                  </select>
                </div>
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
            <Button onClick={fetchAncestors} className="btn-ink">
              重试
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-ink-400 mb-4" />
            <p className="text-ink-600 font-serif">加载先祖列表...</p>
          </div>
        )}

        {/* No Family Selected */}
        {!isLoading && !error && !selectedFamilyId && (
          <div className="card-ink p-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-ink-300" />
            <h2 className="text-xl font-serif text-ink-800 mb-2">请先选择家族</h2>
            <p className="text-ink-500 font-serif mb-6">
              选择上方的家族以查看该家族的先祖列表
            </p>
            <Link href="/families" className="btn-ink">
              <Plus className="h-4 w-4 mr-2" />
              创建或加入家族
            </Link>
          </div>
        )}

        {/* Ancestors Grid */}
        {!isLoading && !error && selectedFamilyId && (
          <>
            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-ink-500">
                共 <span className="font-medium text-ink-700">{pagination.total}</span> 位先祖
                {searchQuery && (
                  <span className="ml-2">
                    (搜索: &quot;{searchQuery}&quot;)
                  </span>
                )}
              </p>
              <p className="text-sm text-ink-400">
                第 {pagination.page} / {pagination.totalPages} 页
              </p>
            </div>

            {/* Ancestors Cards */}
            {ancestors.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ancestors.map((ancestor) => {
                  const age = calculateAge(ancestor)
                  const fullName = getFullName(ancestor)

                  return (
                    <Link
                      key={ancestor.id}
                      href={`/ancestors/${ancestor.id}`}
                      className="group"
                    >
                      <Card className="card-ink-elevated overflow-hidden transition-all duration-300 hover:shadow-ink-xl h-full">
                        {/* Card Header with Avatar */}
                        <CardHeader className="border-b border-paper-300 bg-paper-50/50 p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 text-ink-600 border-2 border-ink-200 group-hover:border-vermilion-400 group-hover:text-vermilion-600 transition-colors">
                              <User className="h-7 w-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg font-serif text-ink-800 group-hover:text-vermilion-700 transition-colors truncate">
                                {fullName}
                              </CardTitle>
                              <p className="text-sm text-ink-500 mt-1">
                                {ancestor.gender}
                                {age && ` · 享年${age}岁`}
                              </p>
                            </div>
                          </div>
                        </CardHeader>

                        {/* Card Content */}
                        <CardContent className="p-4 space-y-3">
                          {/* Birth Info */}
                          <div className="flex items-start gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-ink-400 mt-0.5 shrink-0" />
                            <div className="flex-1">
                              <p className="text-ink-700">
                                {formatDate(ancestor.birthDate)}
                              </p>
                              {ancestor.birthPlace && (
                                <p className="text-ink-400 text-xs flex items-center gap-1 mt-0.5">
                                  <MapPin className="h-3 w-3" />
                                  {ancestor.birthPlace}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Death Info */}
                          {ancestor.deathDate && (
                            <div className="flex items-start gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-ink-400 mt-0.5 shrink-0" />
                              <div className="flex-1">
                                <p className="text-ink-700">
                                  {formatDate(ancestor.deathDate)}
                                </p>
                                {ancestor.deathPlace && (
                                  <p className="text-ink-400 text-xs flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3" />
                                    {ancestor.deathPlace}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Stats */}
                          <div className="divider-ink my-3" />
                          <div className="flex items-center justify-between text-xs text-ink-500">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <ImageIcon className="h-3.5 w-3.5" />
                                {ancestor._count?.photos || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <ScrollText className="h-3.5 w-3.5" />
                                {ancestor._count?.eulogies || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Flame className="h-3.5 w-3.5" />
                                {ancestor._count?.worshipRecords || 0}
                              </span>
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
                  {searchQuery ? "未找到匹配的先祖" : "暂无先祖记录"}
                </h2>
                <p className="text-ink-500 font-serif mb-6">
                  {searchQuery
                    ? `没有找到包含 "${searchQuery}" 的先祖，请尝试其他关键词`
                    : "该家族还没有添加任何先祖信息"}
                </p>
                {families.find((fm) => fm.family.id === selectedFamilyId)?.role ===
                  "EDITOR" ||
                families.find((fm) => fm.family.id === selectedFamilyId)?.role ===
                  "ADMIN" ? (
                  <Link href={`/families/${selectedFamilyId}/ancestors/new`} className="btn-vermilion">
                    <Plus className="h-4 w-4 mr-2" />
                    添加先祖
                  </Link>
                ) : null}
              </div>
            )}

            {/* Pagination */}
            {ancestors.length > 0 && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className={cn(
                    "btn-ink-outline",
                    pagination.page <= 1 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  上一页
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first, last, current, and pages around current
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.page) <= 1
                      )
                    })
                    .map((page, index, array) => {
                      const showEllipsis = index > 0 && array[index - 1] !== page - 1

                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsis && (
                            <span className="px-2 text-ink-400">...</span>
                          )}
                          <Button
                            variant={pagination.page === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={cn(
                              "min-w-[2.5rem]",
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
                    "btn-ink-outline",
                    pagination.page >= pagination.totalPages &&
                      "opacity-50 cursor-not-allowed"
                  )}
                >
                  下一页
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default function AncestorsListPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper-100 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-ink-400" />
            <p className="text-ink-600 font-serif">加载中...</p>
          </div>
        </div>
      }
    >
      <AncestorsListPageContent />
    </Suspense>
  )
}
