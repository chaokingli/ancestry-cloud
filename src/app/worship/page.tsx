"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Flame,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Users,
  User,
  ScrollText,
  Sparkles,
  Hand,
  Coins,
  Wine,
} from "lucide-react"
import { cn } from "@/lib"

// Import worship animation components
import { IncenseLighting } from "@/components/worship/IncenseLighting"
import { Bowing, BowingControl, BowingType } from "@/components/worship/Bowing"
import { Offering, OfferingItem, OfferingType } from "@/components/worship/Offering"
import { PaperMoneyBurning, PaperMoneyType } from "@/components/worship/PaperMoneyBurning"

// Types
interface Ancestor {
  id: string
  firstName: string
  lastName: string | null
  gender: string
  birthDate: string | null
  deathDate: string | null
  birthPlace: string | null
  _count?: {
    worshipRecords: number
  }
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

type WorshipType = "incense" | "offerings" | "bowing" | "paper_money"

interface WorshipConfig {
  type: WorshipType
  label: string
  icon: typeof Flame
  description: string
}

const WORSHIP_TYPES: WorshipConfig[] = [
  {
    type: "incense",
    label: "上香",
    icon: Flame,
    description: "点燃清香，表达敬意",
  },
  {
    type: "offerings",
    label: "供奉",
    icon: Wine,
    description: "供奉祭品，缅怀先祖",
  },
  {
    type: "bowing",
    label: "祭拜",
    icon: Hand,
    description: "行礼致敬，表达孝心",
  },
  {
    type: "paper_money",
    label: "烧纸",
    icon: Coins,
    description: "焚烧纸钱，祈福平安",
  },
]

const OFFERING_OPTIONS: { type: OfferingType; label: string }[] = [
  { type: "apple", label: "苹果" },
  { type: "orange", label: "柑橘" },
  { type: "peach", label: "寿桃" },
  { type: "tea", label: "清茶" },
  { type: "wine", label: "清酒" },
  { type: "rice", label: "米饭" },
  { type: "dish", label: "菜肴" },
]

export default function WorshipPage() {
  const router = useRouter()

  // State
  const [families, setFamilies] = useState<FamilyMember[]>([])
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>("")
  const [ancestors, setAncestors] = useState<Ancestor[]>([])
  const [selectedAncestorId, setSelectedAncestorId] = useState<string>("")
  const [selectedWorshipType, setSelectedWorshipType] = useState<WorshipType | null>(null)

  // Animation states
  const [isIncenseBurning, setIsIncenseBurning] = useState(false)
  const [incenseCount, setIncenseCount] = useState<1 | 2 | 3>(3)
  const [bowingType, setBowingType] = useState<BowingType>("none")
  const [isBowingAnimating, setIsBowingAnimating] = useState(false)
  const [selectedOfferings, setSelectedOfferings] = useState<OfferingType[]>(["apple", "tea", "rice"])
  const [isPresentingOfferings, setIsPresentingOfferings] = useState(false)
  const [paperMoneyType, setPaperMoneyType] = useState<PaperMoneyType>("gold")
  const [isPaperMoneyBurning, setIsPaperMoneyBurning] = useState(false)
  const [paperMoneyAmount, setPaperMoneyAmount] = useState<"small" | "medium" | "large">("medium")

  // Form state
  const [notes, setNotes] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

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
      setIsLoading(true)
      setError(null)

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

      // Reset ancestor selection when family changes
      setSelectedAncestorId("")
    } catch (err) {
      console.error("Error fetching ancestors:", err)
      setError("加载先祖列表时出错，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, selectedFamilyId, router])

  useEffect(() => {
    fetchAncestors()
  }, [fetchAncestors])

  // Get selected ancestor
  const selectedAncestor = ancestors.find((a) => a.id === selectedAncestorId)

  // Get full name
  const getFullName = (ancestor: Ancestor | undefined) => {
    if (!ancestor) return ""
    return `${ancestor.firstName}${ancestor.lastName || ""}`
  }

  // Handle worship type selection
  const handleWorshipTypeSelect = (type: WorshipType) => {
    setSelectedWorshipType(type)
    setSubmitSuccess(false)
    setSubmitError(null)

    // Reset animation states
    setIsIncenseBurning(false)
    setIsBowingAnimating(false)
    setIsPresentingOfferings(false)
    setIsPaperMoneyBurning(false)
    setBowingType("none")
  }

  // Handle animation complete
  const handleAnimationComplete = () => {
    // Animation completed, ready to submit
  }

  // Handle worship submission
  const handleSubmitWorship = async () => {
    if (!selectedAncestorId || !selectedFamilyId || !selectedWorshipType) {
      setSubmitError("请先选择先祖和祭拜方式")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch("/api/worship", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ancestorId: selectedAncestorId,
          familyId: selectedFamilyId,
          worshipType: selectedWorshipType,
          notes: notes.trim() || null,
        }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login")
          return
        }
        const data = await res.json()
        throw new Error(data.message || "创建祭拜记录失败")
      }

      setSubmitSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setSelectedWorshipType(null)
        setNotes("")
        setSubmitSuccess(false)
        setIsIncenseBurning(false)
        setIsBowingAnimating(false)
        setIsPresentingOfferings(false)
        setIsPaperMoneyBurning(false)
        setBowingType("none")
      }, 3000)
    } catch (err) {
      console.error("Error submitting worship:", err)
      setSubmitError(err instanceof Error ? err.message : "提交祭拜记录失败")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle offering selection
  const toggleOffering = (type: OfferingType) => {
    setSelectedOfferings((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type)
      }
      if (prev.length >= 5) {
        return prev // Max 5 offerings
      }
      return [...prev, type]
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
              <span className="text-ink-800">祭拜先祖</span>
            </nav>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-vermilion-100 text-vermilion-700">
              <Flame className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-ink-900">
              祭拜先祖
            </h1>
          </div>
          <p className="text-ink-500 font-serif ml-13">
            以传统礼仪缅怀先祖，表达感恩与敬意
          </p>
        </div>

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

        {/* Selection Panel */}
        {!isLoading && !error && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Panel - Selection */}
            <div className="space-y-6">
              {/* Family Selection */}
              <Card className="card-ink-elevated">
                <CardHeader className="border-b border-paper-300 bg-paper-50/50 p-4">
                  <CardTitle className="text-lg font-serif text-ink-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-ink-500" />
                    选择家族
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {families.length > 0 ? (
                    <select
                      value={selectedFamilyId}
                      onChange={(e) => setSelectedFamilyId(e.target.value)}
                      className="input-ink w-full"
                    >
                      <option value="">请选择家族</option>
                      {families.map((fm) => (
                        <option key={fm.family.id} value={fm.family.id}>
                          {fm.family.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-ink-500 font-serif mb-4">您还没有加入任何家族</p>
                      <Link href="/families" className="btn-vermilion text-sm">
                        创建或加入家族
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ancestor Selection */}
              {selectedFamilyId && (
                <Card className="card-ink-elevated">
                  <CardHeader className="border-b border-paper-300 bg-paper-50/50 p-4">
                    <CardTitle className="text-lg font-serif text-ink-800 flex items-center gap-2">
                      <User className="h-5 w-5 text-ink-500" />
                      选择先祖
                      <span className="text-sm text-ink-400 font-normal">
                        ({ancestors.length}位)
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {ancestors.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {ancestors.map((ancestor) => (
                          <button
                            key={ancestor.id}
                            onClick={() => setSelectedAncestorId(ancestor.id)}
                            className={cn(
                              "w-full text-left p-3 rounded-lg border transition-all duration-200",
                              selectedAncestorId === ancestor.id
                                ? "border-vermilion-500 bg-vermilion-50"
                                : "border-paper-300 hover:border-ink-300 hover:bg-paper-50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center text-lg",
                                selectedAncestorId === ancestor.id
                                  ? "bg-vermilion-100 text-vermilion-700"
                                  : "bg-ink-100 text-ink-600"
                              )}>
                                {ancestor.gender === "男" ? "👴" : ancestor.gender === "女" ? "👵" : "👤"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-serif font-medium text-ink-800 truncate">
                                  {getFullName(ancestor)}
                                </p>
                                <p className="text-xs text-ink-500">
                                  {ancestor.birthPlace || "籍贯未知"}
                                </p>
                              </div>
                              {selectedAncestorId === ancestor.id && (
                                <Sparkles className="h-4 w-4 text-vermilion-500" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <User className="h-12 w-12 mx-auto mb-3 text-ink-300" />
                        <p className="text-ink-500 font-serif mb-4">该家族暂无先祖记录</p>
                        <Link
                          href={`/families/${selectedFamilyId}/ancestors/new`}
                          className="btn-vermilion text-sm"
                        >
                          添加先祖
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Worship Type Selection */}
              {selectedAncestorId && (
                <Card className="card-ink-elevated">
                  <CardHeader className="border-b border-paper-300 bg-paper-50/50 p-4">
                    <CardTitle className="text-lg font-serif text-ink-800 flex items-center gap-2">
                      <ScrollText className="h-5 w-5 text-ink-500" />
                      选择祭拜方式
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {WORSHIP_TYPES.map((worship) => {
                        const Icon = worship.icon
                        return (
                          <button
                            key={worship.type}
                            onClick={() => handleWorshipTypeSelect(worship.type)}
                            className={cn(
                              "p-4 rounded-lg border text-center transition-all duration-200",
                              selectedWorshipType === worship.type
                                ? "border-vermilion-500 bg-vermilion-50 shadow-md"
                                : "border-paper-300 hover:border-ink-300 hover:bg-paper-50"
                            )}
                          >
                            <Icon className={cn(
                              "h-6 w-6 mx-auto mb-2",
                              selectedWorshipType === worship.type
                                ? "text-vermilion-600"
                                : "text-ink-500"
                            )} />
                            <p className={cn(
                              "font-serif font-medium",
                              selectedWorshipType === worship.type
                                ? "text-vermilion-800"
                                : "text-ink-700"
                            )}>
                              {worship.label}
                            </p>
                            <p className="text-xs text-ink-400 mt-1">
                              {worship.description}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Panel - Worship Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Selected Ancestor Display */}
              {selectedAncestor && (
                <Card className="card-ink-elevated border-vermilion-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-vermilion-100 flex items-center justify-center text-3xl">
                        {selectedAncestor.gender === "男" ? "👴" : selectedAncestor.gender === "女" ? "👵" : "👤"}
                      </div>
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-ink-900">
                          {getFullName(selectedAncestor)}
                        </h2>
                        <p className="text-ink-500 font-serif">
                          {selectedAncestor.birthPlace || "籍贯未知"}
                          {selectedAncestor.birthDate && ` · ${new Date(selectedAncestor.birthDate).getFullYear()}年`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Worship Animation Area */}
              {selectedWorshipType && (
                <Card className="card-ink-elevated">
                  <CardHeader className="border-b border-paper-300 bg-paper-50/50 p-4">
                    <CardTitle className="text-lg font-serif text-ink-800">
                      {WORSHIP_TYPES.find((w) => w.type === selectedWorshipType)?.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Incense Lighting */}
                    {selectedWorshipType === "incense" && (
                      <div className="space-y-6">
                        <div className="flex justify-center py-8 bg-paper-50 rounded-lg">
                          <IncenseLighting
                            count={incenseCount}
                            isBurning={isIncenseBurning}
                            onComplete={handleAnimationComplete}
                          />
                        </div>
                        <div className="flex items-center justify-center gap-4">
                          <span className="text-sm text-ink-600 font-serif">上香数量:</span>
                          <div className="flex gap-2">
                            {[1, 2, 3].map((count) => (
                              <button
                                key={count}
                                onClick={() => setIncenseCount(count as 1 | 2 | 3)}
                                disabled={isIncenseBurning}
                                className={cn(
                                  "px-4 py-2 rounded-lg border font-serif transition-all",
                                  incenseCount === count
                                    ? "border-vermilion-500 bg-vermilion-50 text-vermilion-700"
                                    : "border-paper-300 hover:border-ink-300"
                                )}
                              >
                                {count}支
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <Button
                            onClick={() => setIsIncenseBurning(!isIncenseBurning)}
                            className={cn(
                              "btn-vermilion",
                              isIncenseBurning && "opacity-50"
                            )}
                            disabled={isIncenseBurning}
                          >
                            <Flame className="h-4 w-4 mr-2" />
                            {isIncenseBurning ? "上香中..." : "开始上香"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Offerings */}
                    {selectedWorshipType === "offerings" && (
                      <div className="space-y-6">
                        <div className="flex justify-center py-4 bg-paper-50 rounded-lg">
                          <Offering
                            offerings={selectedOfferings.map((type) => ({ type }))}
                            isPresenting={isPresentingOfferings}
                            onComplete={handleAnimationComplete}
                          />
                        </div>
                        <div className="space-y-3">
                          <span className="text-sm text-ink-600 font-serif">选择供品 (最多5样):</span>
                          <div className="flex flex-wrap gap-2">
                            {OFFERING_OPTIONS.map((offering) => (
                              <button
                                key={offering.type}
                                onClick={() => toggleOffering(offering.type)}
                                disabled={isPresentingOfferings}
                                className={cn(
                                  "px-3 py-1.5 rounded-full border text-sm font-serif transition-all",
                                  selectedOfferings.includes(offering.type)
                                    ? "border-vermilion-500 bg-vermilion-50 text-vermilion-700"
                                    : "border-paper-300 hover:border-ink-300 text-ink-600"
                                )}
                              >
                                {offering.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <Button
                            onClick={() => setIsPresentingOfferings(!isPresentingOfferings)}
                            className="btn-vermilion"
                            disabled={selectedOfferings.length === 0 || isPresentingOfferings}
                          >
                            <Wine className="h-4 w-4 mr-2" />
                            {isPresentingOfferings ? "供奉中..." : "开始供奉"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Bowing */}
                    {selectedWorshipType === "bowing" && (
                      <div className="space-y-6">
                        <div className="flex justify-center py-4 bg-paper-50 rounded-lg">
                          <Bowing
                            type={bowingType}
                            isAnimating={isBowingAnimating}
                            onComplete={handleAnimationComplete}
                          />
                        </div>
                        <BowingControl
                          selectedType={bowingType}
                          isAnimating={isBowingAnimating}
                          onTypeSelect={setBowingType}
                          onAnimateToggle={() => setIsBowingAnimating(!isBowingAnimating)}
                          onReset={() => {
                            setIsBowingAnimating(false)
                            setBowingType("none")
                          }}
                        />
                      </div>
                    )}

                    {/* Paper Money Burning */}
                    {selectedWorshipType === "paper_money" && (
                      <div className="space-y-6">
                        <div className="flex justify-center py-4 bg-paper-50 rounded-lg">
                          <PaperMoneyBurning
                            type={paperMoneyType}
                            isBurning={isPaperMoneyBurning}
                            amount={paperMoneyAmount}
                            onComplete={handleAnimationComplete}
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center gap-4">
                            <span className="text-sm text-ink-600 font-serif">纸钱类型:</span>
                            <div className="flex gap-2">
                              {[
                                { type: "gold" as PaperMoneyType, label: "金纸" },
                                { type: "silver" as PaperMoneyType, label: "银纸" },
                                { type: "mixed" as PaperMoneyType, label: "混合" },
                              ].map((option) => (
                                <button
                                  key={option.type}
                                  onClick={() => setPaperMoneyType(option.type)}
                                  disabled={isPaperMoneyBurning}
                                  className={cn(
                                    "px-4 py-2 rounded-lg border font-serif transition-all",
                                    paperMoneyType === option.type
                                      ? "border-vermilion-500 bg-vermilion-50 text-vermilion-700"
                                      : "border-paper-300 hover:border-ink-300"
                                  )}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-4">
                            <span className="text-sm text-ink-600 font-serif">数量:</span>
                            <div className="flex gap-2">
                              {[
                                { amount: "small" as const, label: "少量" },
                                { amount: "medium" as const, label: "中等" },
                                { amount: "large" as const, label: "大量" },
                              ].map((option) => (
                                <button
                                  key={option.amount}
                                  onClick={() => setPaperMoneyAmount(option.amount)}
                                  disabled={isPaperMoneyBurning}
                                  className={cn(
                                    "px-4 py-2 rounded-lg border font-serif transition-all",
                                    paperMoneyAmount === option.amount
                                      ? "border-vermilion-500 bg-vermilion-50 text-vermilion-700"
                                      : "border-paper-300 hover:border-ink-300"
                                  )}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <Button
                            onClick={() => setIsPaperMoneyBurning(!isPaperMoneyBurning)}
                            className="btn-vermilion"
                            disabled={isPaperMoneyBurning}
                          >
                            <Flame className="h-4 w-4 mr-2" />
                            {isPaperMoneyBurning ? "焚烧中..." : "开始焚烧"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    <div className="mt-6 pt-6 border-t border-paper-300">
                      <label className="block text-sm font-medium text-ink-700 font-serif mb-2">
                        祭拜寄语 (可选)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="写下您想对先祖说的话..."
                        className="input-ink min-h-[80px] resize-none w-full"
                        maxLength={500}
                        rows={3}
                      />
                      <p className="text-xs text-ink-400 text-right mt-1">
                        {notes.length}/500
                      </p>
                    </div>

                    {/* Error Message */}
                    {submitError && (
                      <div className="mt-4 p-3 bg-vermilion-50 border border-vermilion-200 rounded-lg">
                        <p className="text-sm text-vermilion-700 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {submitError}
                        </p>
                      </div>
                    )}

                    {/* Success Message */}
                    {submitSuccess && (
                      <div className="mt-4 p-3 bg-jade-50 border border-jade-200 rounded-lg">
                        <p className="text-sm text-jade-700 flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          祭拜记录已保存，感恩您的虔诚
                        </p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-center">
                      <Button
                        onClick={handleSubmitWorship}
                        disabled={isSubmitting || submitSuccess}
                        className={cn(
                          "btn-vermilion px-8",
                          (isSubmitting || submitSuccess) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            保存中...
                          </>
                        ) : submitSuccess ? (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            已完成
                          </>
                        ) : (
                          <>
                            <Flame className="h-4 w-4 mr-2" />
                            完成祭拜
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Empty State - No selection */}
              {!selectedAncestorId && (
                <div className="card-ink p-12 text-center">
                  <Flame className="h-16 w-16 mx-auto mb-4 text-ink-300" />
                  <h2 className="text-xl font-serif text-ink-800 mb-2">开始祭拜</h2>
                  <p className="text-ink-500 font-serif">
                    请先选择家族和先祖，然后选择祭拜方式
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
