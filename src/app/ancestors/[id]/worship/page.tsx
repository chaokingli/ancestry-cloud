"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  IncenseLighting,
  Offering,
  Bowing,
  BowingControl,
  PaperMoneyBurning,
  type OfferingItem,
  type OfferingType,
  type BowingType,
  type PaperMoneyType,
} from "@/components/worship"
import {
  ArrowLeft,
  User,
  Flame,
  Loader2,
  AlertCircle,
  ChevronLeft,
  CheckCircle2,
  X,
} from "lucide-react"

// Types
interface Ancestor {
  id: string
  firstName: string
  lastName: string | null
  gender: string
  birthDate: string | null
  deathDate: string | null
  bio: string | null
  familyId: string
}

type WorshipType = "incense" | "offerings" | "bowing" | "paper_money"

interface PageParams {
  id: string
}

interface WorshipOption {
  type: WorshipType
  title: string
  description: string
  icon: React.ReactNode
}

const WORSHIP_OPTIONS: WorshipOption[] = [
  {
    type: "incense",
    title: "上香祭拜",
    description: "点燃香烛，袅袅青烟寄哀思",
    icon: <Flame className="h-5 w-5" />,
  },
  {
    type: "offerings",
    title: "供奉祭品",
    description: "献上供品，表达孝心",
    icon: <span className="text-lg">🍎</span>,
  },
  {
    type: "bowing",
    title: "行礼拜祭",
    description: "三叩首或作揖，行传统礼仪",
    icon: <span className="text-lg">🙇</span>,
  },
  {
    type: "paper_money",
    title: "焚烧纸钱",
    description: "金银纸钱，寄往彼岸",
    icon: <span className="text-lg">🔥</span>,
  },
]

const OFFERING_ITEMS: OfferingItem[] = [
  { type: "apple", isVisible: true },
  { type: "orange", isVisible: true },
  { type: "peach", isVisible: true },
  { type: "tea", isVisible: true },
  { type: "wine", isVisible: true },
]

export default function WorshipPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [ancestor, setAncestor] = useState<Ancestor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Worship state
  const [selectedWorshipType, setSelectedWorshipType] = useState<WorshipType | null>(null)
  const [isWorshipping, setIsWorshipping] = useState(false)
  const [worshipComplete, setWorshipComplete] = useState(false)
  const [worshipNotes, setWorshipNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Animation states
  const [incenseCount, setIncenseCount] = useState<1 | 2 | 3>(3)
  const [isIncenseBurning, setIsIncenseBurning] = useState(false)
  const [isOfferingPresenting, setIsOfferingPresenting] = useState(false)
  const [bowingType, setBowingType] = useState<BowingType>("none")
  const [isBowingAnimating, setIsBowingAnimating] = useState(false)
  const [paperMoneyType, setPaperMoneyType] = useState<PaperMoneyType>("gold")
  const [isPaperMoneyBurning, setIsPaperMoneyBurning] = useState(false)

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
        })
        if (!res.ok || res.status === 401) {
          router.push("/login")
          return
        }
        const data = await res.json()
        if (!data.user?.id) {
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

  // Fetch ancestor data
  useEffect(() => {
    if (!isAuthenticated || !id) return

    const fetchAncestorData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const ancestorRes = await fetch(`/api/ancestors/${id}`, {
          credentials: "include",
        })

        if (!ancestorRes.ok) {
          if (ancestorRes.status === 401) {
            router.push("/login")
            return
          }
          if (ancestorRes.status === 404) {
            setError("先祖信息不存在")
            return
          }
          if (ancestorRes.status === 403) {
            setError("您没有权限查看此先祖信息")
            return
          }
          throw new Error("获取先祖信息失败")
        }

        const ancestorData = await ancestorRes.json()
        setAncestor(ancestorData.ancestor)
      } catch (err) {
        console.error("Error fetching ancestor data:", err)
        setError("加载先祖信息时出错，请稍后重试")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAncestorData()
  }, [id, isAuthenticated, router])

  // Handle worship type selection
  const handleSelectWorshipType = (type: WorshipType) => {
    setSelectedWorshipType(type)
    setWorshipComplete(false)
    setSubmitError(null)

    // Reset animation states
    setIsIncenseBurning(false)
    setIsOfferingPresenting(false)
    setIsBowingAnimating(false)
    setBowingType("none")
    setIsPaperMoneyBurning(false)
  }

  // Handle worship start
  const handleStartWorship = () => {
    setIsWorshipping(true)

    switch (selectedWorshipType) {
      case "incense":
        setIsIncenseBurning(true)
        break
      case "offerings":
        setIsOfferingPresenting(true)
        break
      case "bowing":
        if (bowingType !== "none") {
          setIsBowingAnimating(true)
        }
        break
      case "paper_money":
        setIsPaperMoneyBurning(true)
        break
    }
  }

  // Handle worship completion
  const handleWorshipComplete = () => {
    setIsWorshipping(false)
    setWorshipComplete(true)

    // Reset animation states
    setIsIncenseBurning(false)
    setIsOfferingPresenting(false)
    setIsBowingAnimating(false)
    setIsPaperMoneyBurning(false)
  }

  // Handle bowing type selection
  const handleBowingTypeSelect = (type: BowingType) => {
    setBowingType(type)
  }

  // Handle bowing animation toggle
  const handleBowingToggle = () => {
    setIsBowingAnimating(!isBowingAnimating)
  }

  // Handle bowing reset
  const handleBowingReset = () => {
    setIsBowingAnimating(false)
    setWorshipComplete(false)
  }

  // Submit worship record
  const handleSubmitWorship = async () => {
    if (!ancestor || !selectedWorshipType) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/worship", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ancestorId: ancestor.id,
          familyId: ancestor.familyId,
          worshipType: selectedWorshipType,
          notes: worshipNotes.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "创建祭拜记录失败")
      }

      // Redirect back to ancestor page
      router.push(`/ancestors/${id}`)
    } catch (err) {
      console.error("Error submitting worship:", err)
      setSubmitError(err instanceof Error ? err.message : "创建祭拜记录失败")
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-ink-400" />
          <p className="text-ink-600 font-serif">加载中...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-paper-100 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="card-ink p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-vermilion-500" />
            <h2 className="text-xl font-serif text-ink-800 mb-2">出错了</h2>
            <p className="text-ink-600 font-serif mb-6">{error}</p>
            <Link href="/families" className="btn-ink">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回家族列表
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // No ancestor data
  if (!ancestor) {
    return (
      <div className="min-h-screen bg-paper-100 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="card-ink p-8 text-center">
            <p className="text-ink-600 font-serif mb-4">未找到先祖信息</p>
            <Link href="/families" className="btn-ink">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回家族列表
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const fullName = `${ancestor.firstName}${ancestor.lastName || ""}`

  return (
    <div className="min-h-screen bg-paper-100">
      {/* Header Navigation */}
      <div className="border-b border-paper-400 bg-paper-50">
        <div className="mx-auto max-w-6xl px-4 py-4">
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
              <Link href="/families" className="hover:text-ink-700">
                家族
              </Link>
              <span>/</span>
              <Link href={`/ancestors/${id}`} className="hover:text-ink-700">
                {fullName}
              </Link>
              <span>/</span>
              <span className="text-ink-800">祭拜</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-8">
        {/* Ancestor Header */}
        <div className="mb-6 sm:mb-8 text-center px-2">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-ink-100 text-ink-700 border-2 border-ink-200">
              <User className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink-900 mb-2">
            祭拜 {fullName}
          </h1>
          <p className="text-ink-500 font-serif text-sm sm:text-base">
            以传统之礼，表追思之情
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Worship Options */}
          <div className="space-y-4">
            <Card className="card-ink">
              <CardHeader className="border-b border-paper-300">
                <CardTitle className="text-lg font-serif text-ink-800 flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  选择祭拜方式
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {WORSHIP_OPTIONS.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => handleSelectWorshipType(option.type)}
                    disabled={isWorshipping}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedWorshipType === option.type
                        ? "border-vermilion-500 bg-vermilion-50"
                        : "border-paper-300 bg-paper-50 hover:border-ink-300 hover:bg-paper-100"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedWorshipType === option.type
                            ? "bg-vermilion-100 text-vermilion-600"
                            : "bg-paper-200 text-ink-500"
                        }`}
                      >
                        {option.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-medium text-ink-800">
                          {option.title}
                        </h3>
                        <p className="text-sm text-ink-500 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Back Link */}
            <Link
              href={`/ancestors/${id}`}
              className="btn-ink w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              返回先祖详情
            </Link>
          </div>

          {/* Right Column - Worship Display */}
          <div className="lg:col-span-2">
            {!selectedWorshipType ? (
              <Card className="card-ink h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-paper-200 flex items-center justify-center">
                    <Flame className="h-10 w-10 text-ink-400" />
                  </div>
                  <h3 className="text-lg font-serif text-ink-700 mb-2">
                    请选择祭拜方式
                  </h3>
                  <p className="text-sm text-ink-500 font-serif">
                    从左侧选择一种传统祭拜方式，开始您的祭拜仪式
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="card-ink">
                <CardHeader className="border-b border-paper-300">
                  <CardTitle className="text-lg font-serif text-ink-800 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {WORSHIP_OPTIONS.find((o) => o.type === selectedWorshipType)?.icon}
                      {WORSHIP_OPTIONS.find((o) => o.type === selectedWorshipType)?.title}
                    </span>
                    {!isWorshipping && !worshipComplete && (
                      <button
                        onClick={() => setSelectedWorshipType(null)}
                        className="text-ink-400 hover:text-ink-600 p-1"
                        aria-label="关闭"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Worship Animation Area */}
                  <div className="bg-paper-100 rounded-lg p-6 sm:p-8 mb-6 min-h-[300px] flex items-center justify-center">
                    {selectedWorshipType === "incense" && (
                      <div className="text-center">
                        {!isWorshipping && !worshipComplete ? (
                          <div className="space-y-4">
                            <p className="text-ink-600 font-serif">选择上香数量</p>
                            <div className="flex justify-center gap-4">
                              {[1, 2, 3].map((count) => (
                                <button
                                  key={count}
                                  onClick={() => setIncenseCount(count as 1 | 2 | 3)}
                                  className={`w-12 h-12 rounded-full border-2 font-serif text-lg transition-all ${
                                    incenseCount === count
                                      ? "border-vermilion-500 bg-vermilion-50 text-vermilion-700"
                                      : "border-paper-400 bg-white text-ink-600 hover:border-ink-400"
                                  }`}
                                >
                                  {count}支
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <IncenseLighting
                            count={incenseCount}
                            isBurning={isIncenseBurning}
                            onComplete={handleWorshipComplete}
                          />
                        )}
                      </div>
                    )}

                    {selectedWorshipType === "offerings" && (
                      <Offering
                        offerings={OFFERING_ITEMS}
                        isPresenting={isOfferingPresenting}
                        onComplete={handleWorshipComplete}
                      />
                    )}

                    {selectedWorshipType === "bowing" && (
                      <div className="w-full">
                        {!isWorshipping && !worshipComplete ? (
                          <BowingControl
                            selectedType={bowingType}
                            onTypeSelect={handleBowingTypeSelect}
                            onAnimateToggle={handleBowingToggle}
                            onReset={handleBowingReset}
                          />
                        ) : (
                          <Bowing
                            type={bowingType}
                            isAnimating={isBowingAnimating}
                            onComplete={handleWorshipComplete}
                          />
                        )}
                      </div>
                    )}

                    {selectedWorshipType === "paper_money" && (
                      <div className="text-center">
                        {!isWorshipping && !worshipComplete ? (
                          <div className="space-y-4">
                            <p className="text-ink-600 font-serif">选择纸钱类型</p>
                            <div className="flex justify-center gap-3">
                              {[
                                { type: "gold", label: "金纸", desc: "财运亨通" },
                                { type: "silver", label: "银纸", desc: "平安吉祥" },
                                { type: "mixed", label: "金银", desc: "福禄双全" },
                              ].map(({ type, label, desc }) => (
                                <button
                                  key={type}
                                  onClick={() => setPaperMoneyType(type as PaperMoneyType)}
                                  className={`px-4 py-3 rounded-lg border-2 text-center transition-all ${
                                    paperMoneyType === type
                                      ? "border-vermilion-500 bg-vermilion-50"
                                      : "border-paper-400 bg-white hover:border-ink-400"
                                  }`}
                                >
                                  <div className="font-serif font-medium text-ink-800">
                                    {label}
                                  </div>
                                  <div className="text-xs text-ink-500 mt-1">{desc}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <PaperMoneyBurning
                            type={paperMoneyType}
                            isBurning={isPaperMoneyBurning}
                            amount="medium"
                            onComplete={handleWorshipComplete}
                          />
                        )}
                      </div>
                    )}

                    {/* Completion Message */}
                    {worshipComplete && (
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-jade-500/10 flex items-center justify-center">
                          <CheckCircle2 className="h-8 w-8 text-jade-500" />
                        </div>
                        <h3 className="text-xl font-serif text-ink-800 mb-2">
                          祭拜完成
                        </h3>
                        <p className="text-ink-600 font-serif">
                          您的祭拜已完成，请添加寄语并保存记录
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Worship Notes */}
                  {(worshipComplete || isWorshipping) && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-ink-700 mb-2 font-serif">
                        祭拜寄语（可选）
                      </label>
                      <textarea
                        value={worshipNotes}
                        onChange={(e) => setWorshipNotes(e.target.value)}
                        placeholder="写下您想对先祖说的话..."
                        className="flex w-full rounded-md border border-paper-400 bg-paper-50 px-3 py-2 text-base text-ink-800 placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-none"
                        disabled={isSubmitting}
                      />
                    </div>
                  )}

                  {/* Error Message */}
                  {submitError && (
                    <div className="mb-4 p-3 rounded-lg bg-vermilion-50 border border-vermilion-200 text-vermilion-700 text-sm">
                      {submitError}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {!isWorshipping && !worshipComplete ? (
                      <button
                        onClick={handleStartWorship}
                        disabled={
                          selectedWorshipType === "bowing" && bowingType === "none"
                        }
                        className="btn-vermilion flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Flame className="h-4 w-4" />
                        开始祭拜
                      </button>
                    ) : worshipComplete ? (
                      <>
                        <button
                          onClick={handleSubmitWorship}
                          disabled={isSubmitting}
                          className="btn-vermilion flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              保存中...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              保存祭拜记录
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setWorshipComplete(false)
                            setIsWorshipping(false)
                          }}
                          disabled={isSubmitting}
                          className="btn-ink flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                          重新祭拜
                        </button>
                      </>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
