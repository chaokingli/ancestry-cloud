"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ScrollText,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Users,
  User,
  Plus,
  FileText,
  Clock,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  BookTemplate,
} from "lucide-react"
import { cn } from "@/lib"

// Types
interface Eulogy {
  id: string
  content: string
  isTemplate: boolean
  templateName: string | null
  createdAt: string
  updatedAt: string
  authorId: string
  author?: {
    id: string
    name: string | null
    email: string
  }
  ancestor?: {
    id: string
    firstName: string
    lastName: string | null
  }
  ancestorId: string
}

interface EulogyTemplate {
  id: string
  content: string
  templateName: string
  createdAt: string
}

interface Family {
  id: string
  name: string
  description: string | null
}

interface FamilyMember {
  family: Family
  role: "ADMIN" | "EDITOR" | "VIEWER"
}

interface Ancestor {
  id: string
  firstName: string
  lastName: string | null
}

export default function EulogyPage() {
  const router = useRouter()

  // State
  const [families, setFamilies] = useState<FamilyMember[]>([])
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>("")
  const [ancestors, setAncestors] = useState<Ancestor[]>([])
  const [eulogies, setEulogies] = useState<Eulogy[]>([])
  const [templates, setTemplates] = useState<EulogyTemplate[]>([])
  const [expandedEulogyId, setExpandedEulogyId] = useState<string | null>(null)

  // Form state for creating eulogy
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedAncestorId, setSelectedAncestorId] = useState<string>("")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [eulogyContent, setEulogyContent] = useState<string>("")
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  // Fetch ancestors when family changes
  const fetchAncestors = useCallback(async () => {
    if (!isAuthenticated || !selectedFamilyId) return

    try {
      const res = await fetch(`/api/ancestors?familyId=${selectedFamilyId}&limit=100`, {
        credentials: "include",
      })

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login")
          return
        }
        throw new Error("获取先祖列表失败")
      }

      const data = await res.json()
      setAncestors(data.ancestors || [])
    } catch (err) {
      console.error("Error fetching ancestors:", err)
    }
  }, [isAuthenticated, selectedFamilyId, router])

  useEffect(() => {
    fetchAncestors()
  }, [fetchAncestors])

  // Fetch eulogies when family changes
  const fetchEulogies = useCallback(async () => {
    if (!isAuthenticated || !selectedFamilyId) return

    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch(`/api/eulogies?familyId=${selectedFamilyId}`, {
        credentials: "include",
      })

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login")
          return
        }
        if (res.status === 403) {
          setError("您没有权限查看该家族的祭文")
          return
        }
        throw new Error("获取祭文列表失败")
      }

      const data = await res.json()
      setEulogies(data.eulogies || [])
    } catch (err) {
      console.error("Error fetching eulogies:", err)
      setError("加载祭文列表时出错，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, selectedFamilyId, router])

  useEffect(() => {
    fetchEulogies()
  }, [fetchEulogies])

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    if (!isAuthenticated || !selectedFamilyId) return

    try {
      const res = await fetch(`/api/eulogies/templates?familyId=${selectedFamilyId}`, {
        credentials: "include",
      })

      if (res.ok) {
        const data = await res.json()
        setTemplates(data.templates || [])
      }
    } catch (err) {
      console.error("Error fetching templates:", err)
    }
  }, [isAuthenticated, selectedFamilyId])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId)
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setEulogyContent(template.content)
    }
  }

  // Handle create eulogy
  const handleCreateEulogy = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAncestorId || !eulogyContent.trim()) return

    setIsCreating(true)
    setCreateError(null)

    try {
      const res = await fetch("/api/eulogies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ancestorId: selectedAncestorId,
          content: eulogyContent.trim(),
        }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login")
          return
        }
        const data = await res.json()
        throw new Error(data.message || "创建祭文失败")
      }

      const data = await res.json()

      // Add new eulogy to list
      setEulogies((prev) => [data.eulogy, ...prev])

      // Reset form and close modal
      setSelectedAncestorId("")
      setSelectedTemplateId("")
      setEulogyContent("")
      setIsCreateModalOpen(false)
    } catch (err) {
      console.error("Error creating eulogy:", err)
      setCreateError(err instanceof Error ? err.message : "创建祭文失败")
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get ancestor name
  const getAncestorName = (eulogy: Eulogy) => {
    if (eulogy.ancestor) {
      return `${eulogy.ancestor.firstName}${eulogy.ancestor.lastName || ""}`
    }
    const ancestor = ancestors.find((a) => a.id === eulogy.ancestorId)
    return ancestor ? `${ancestor.firstName}${ancestor.lastName || ""}` : "未知先祖"
  }

  // Get author name
  const getAuthorName = (eulogy: Eulogy) => {
    if (eulogy.author) {
      return eulogy.author.name || eulogy.author.email
    }
    return "未知作者"
  }

  // Check if user has edit permission
  const hasEditPermission = () => {
    const familyMember = families.find((fm) => fm.family.id === selectedFamilyId)
    return familyMember?.role === "ADMIN" || familyMember?.role === "EDITOR"
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
              <span className="text-ink-800">祭文管理</span>
            </nav>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-ink-100 text-ink-700">
              <ScrollText className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-ink-900">
              祭文管理
            </h1>
          </div>
          <p className="text-ink-500 font-serif ml-13">
            撰写和缅怀先祖的祭文，传承家族记忆
          </p>
        </div>

        {/* Filters Bar */}
        <Card className="card-ink mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Family Selector */}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-ink-400" />
                <select
                  value={selectedFamilyId}
                  onChange={(e) => setSelectedFamilyId(e.target.value)}
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

              {/* Create Button */}
              {hasEditPermission() && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-vermilion"
                  disabled={!selectedFamilyId || ancestors.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  撰写祭文
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <div className="card-ink p-8 text-center mb-6">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-vermilion-500" />
            <h2 className="text-xl font-serif text-ink-800 mb-2">出错了</h2>
            <p className="text-ink-600 font-serif mb-6">{error}</p>
            <Button onClick={fetchEulogies} className="btn-ink">
              重试
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-ink-400 mb-4" />
            <p className="text-ink-600 font-serif">加载祭文列表...</p>
          </div>
        )}

        {/* No Family Selected */}
        {!isLoading && !error && !selectedFamilyId && (
          <div className="card-ink p-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-ink-300" />
            <h2 className="text-xl font-serif text-ink-800 mb-2">请先选择家族</h2>
            <p className="text-ink-500 font-serif mb-6">
              选择上方的家族以查看该家族的祭文列表
            </p>
            <Link href="/families" className="btn-ink">
              <Plus className="h-4 w-4 mr-2" />
              创建或加入家族
            </Link>
          </div>
        )}

        {/* Eulogy List */}
        {!isLoading && !error && selectedFamilyId && (
          <>
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-ink-500">
                共 <span className="font-medium text-ink-700">{eulogies.length}</span> 篇祭文
              </p>
            </div>

            {/* Eulogy Cards */}
            {eulogies.length > 0 ? (
              <div className="grid gap-6">
                {eulogies.map((eulogy) => {
                  const isExpanded = expandedEulogyId === eulogy.id
                  const ancestorName = getAncestorName(eulogy)
                  const authorName = getAuthorName(eulogy)

                  return (
                    <Card
                      key={eulogy.id}
                      className={cn(
                        "card-ink-elevated overflow-hidden transition-all duration-300",
                        isExpanded && "shadow-ink-lg"
                      )}
                    >
                      {/* Card Header */}
                      <CardHeader className="border-b border-paper-300 bg-paper-50/50 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-100 text-ink-600">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-serif text-ink-800">
                                {ancestorName}
                              </CardTitle>
                              <div className="flex items-center gap-3 mt-1 text-xs text-ink-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(eulogy.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {authorName}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedEulogyId(isExpanded ? null : eulogy.id)}
                            className="text-ink-400 hover:text-ink-600"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>

                      {/* Card Content */}
                      <CardContent className="p-4">
                        <div
                          className={cn(
                            "font-serif text-ink-700 whitespace-pre-wrap transition-all duration-300",
                            isExpanded ? "max-h-none" : "max-h-24 overflow-hidden relative"
                          )}
                        >
                          {eulogy.content}
                          {!isExpanded && eulogy.content.length > 100 && (
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-paper-50 to-transparent" />
                          )}
                        </div>

                        {/* Expand/Collapse Button */}
                        {eulogy.content.length > 100 && (
                          <button
                            onClick={() => setExpandedEulogyId(isExpanded ? null : eulogy.id)}
                            className="mt-2 text-sm text-vermilion-600 hover:text-vermilion-700 font-medium"
                          >
                            {isExpanded ? "收起" : "展开全文"}
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="card-ink p-12 text-center">
                <ScrollText className="h-16 w-16 mx-auto mb-4 text-ink-300" />
                <h2 className="text-xl font-serif text-ink-800 mb-2">暂无祭文</h2>
                <p className="text-ink-500 font-serif mb-6">
                  该家族还没有添加任何祭文
                </p>
                {hasEditPermission() && ancestors.length > 0 && (
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-vermilion"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    撰写第一篇祭文
                  </Button>
                )}
                {hasEditPermission() && ancestors.length === 0 && (
                  <Link href={`/families/${selectedFamilyId}/ancestors/new`} className="btn-vermilion">
                    <Plus className="h-4 w-4 mr-2" />
                    先添加先祖
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Eulogy Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl card-ink-elevated overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="border-b border-paper-300 bg-paper-50/50 p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-vermilion-100 text-vermilion-600">
                    <ScrollText className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-ink-900">
                    撰写祭文
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreateModalOpen(false)
                    setCreateError(null)
                    setSelectedAncestorId("")
                    setSelectedTemplateId("")
                    setEulogyContent("")
                  }}
                  className="text-ink-400 hover:text-ink-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <form onSubmit={handleCreateEulogy} className="space-y-6">
                {/* Ancestor Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink-700 font-serif">
                    选择先祖 <span className="text-vermilion-500">*</span>
                  </label>
                  <select
                    value={selectedAncestorId}
                    onChange={(e) => setSelectedAncestorId(e.target.value)}
                    className="input-ink w-full"
                    required
                  >
                    <option value="">请选择先祖</option>
                    {ancestors.map((ancestor) => (
                      <option key={ancestor.id} value={ancestor.id}>
                        {ancestor.firstName}{ancestor.lastName || ""}
                      </option>
                    ))}
                  </select>
                  {ancestors.length === 0 && (
                    <p className="text-sm text-vermilion-600">
                      该家族暂无先祖，请先添加先祖
                    </p>
                  )}
                </div>

                {/* Template Selection */}
                {templates.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink-700 font-serif flex items-center gap-2">
                      <BookTemplate className="h-4 w-4" />
                      使用模板
                    </label>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => handleTemplateSelect(e.target.value)}
                      className="input-ink w-full"
                    >
                      <option value="">不使用模板</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.templateName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Eulogy Content */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink-700 font-serif">
                    祭文内容 <span className="text-vermilion-500">*</span>
                  </label>
                  <textarea
                    value={eulogyContent}
                    onChange={(e) => setEulogyContent(e.target.value)}
                    placeholder="在此撰写祭文..."
                    className="input-ink min-h-[200px] resize-none w-full"
                    required
                    rows={8}
                  />
                  <p className="text-xs text-ink-400 text-right">
                    {eulogyContent.length} 字
                  </p>
                </div>

                {/* Error Message */}
                {createError && (
                  <div className="flex items-center gap-2 text-sm text-vermilion-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{createError}</span>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateModalOpen(false)
                      setCreateError(null)
                      setSelectedAncestorId("")
                      setSelectedTemplateId("")
                      setEulogyContent("")
                    }}
                    className="flex-1 btn-ink-outline"
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    disabled={!selectedAncestorId || !eulogyContent.trim() || isCreating}
                    className={cn(
                      "flex-1 btn-vermilion",
                      (!selectedAncestorId || !eulogyContent.trim() || isCreating) &&
                        "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        保存祭文
                      </>
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
