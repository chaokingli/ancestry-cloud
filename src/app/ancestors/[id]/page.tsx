"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
// import { auth } from "@/lib/auth"  // Removed - auth() is server-side only
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BLUR_DATA_URLS } from "@/components/ui/shimmer"
import { PhotoUpload } from "@/components/ancestor/PhotoUpload"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Flame,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
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

interface Photo {
  id: string
  title: string
  description: string | null
  imageUrl: string
  uploadedAt: string
  uploader: {
    id: string
    name: string
    email: string
  }
}

interface PageParams {
  id: string
}

export default function AncestorDetailPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [ancestor, setAncestor] = useState<Ancestor | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check session via API
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

        // Fetch ancestor details
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

        // Fetch photos for this ancestor
        const photosRes = await fetch(
          `/api/albums?ancestorId=${id}&limit=50`,
          { credentials: "include" }
        )

        if (photosRes.ok) {
          const photosData = await photosRes.json()
          setPhotos(photosData.photos || [])
        }
      } catch (err) {
        console.error("Error fetching ancestor data:", err)
        setError("加载先祖信息时出错，请稍后重试")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAncestorData()
  }, [id, isAuthenticated, router])

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
  const calculateAge = () => {
    if (!ancestor?.birthDate) return null
    const birth = new Date(ancestor.birthDate)
    const end = ancestor.deathDate ? new Date(ancestor.deathDate) : new Date()
    const age = end.getFullYear() - birth.getFullYear()
    return age > 0 ? age : null
  }

  // Navigate photos
  const goToPreviousPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const goToNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
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

  const age = calculateAge()
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
              <span className="text-ink-800">{fullName}</span>
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
            {fullName}
          </h1>
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-ink-500 text-sm sm:text-base flex-wrap">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {ancestor.gender}
            </span>
            {age && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                享年{age}岁
              </span>
            )}
          </div>
        </div>
        {/* Ancestor Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-100 text-ink-700 border-2 border-ink-200">
              <User className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-ink-900 mb-2">
            {fullName}
          </h1>
          <div className="flex items-center justify-center gap-4 text-ink-500">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {ancestor.gender}
            </span>
            {age && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                享年{age}岁
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Basic Information Card */}
            <Card className="card-ink">
              <CardHeader className="border-b border-paper-300">
                <CardTitle className="text-lg font-serif text-ink-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-ink-500" />
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Birth Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-ink-600">
                    <Calendar className="h-4 w-4 text-ink-400" />
                    <span className="text-sm font-medium">出生</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    <p className="text-ink-800 font-serif">
                      {formatDate(ancestor.birthDate)}
                    </p>
                    {ancestor.birthPlace && (
                      <p className="text-ink-500 text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {ancestor.birthPlace}
                      </p>
                    )}
                  </div>
                </div>

                {/* Death Info */}
                {ancestor.deathDate && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-ink-600">
                      <Calendar className="h-4 w-4 text-ink-400" />
                      <span className="text-sm font-medium">离世</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      <p className="text-ink-800 font-serif">
                        {formatDate(ancestor.deathDate)}
                      </p>
                      {ancestor.deathPlace && (
                        <p className="text-ink-500 text-sm flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {ancestor.deathPlace}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="divider-ink" />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-ink-800">
                      {ancestor._count?.photos || 0}
                    </p>
                    <p className="text-xs text-ink-500">照片</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-ink-800">
                      {ancestor._count?.eulogies || 0}
                    </p>
                    <p className="text-xs text-ink-500">祭文</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-ink-800">
                      {ancestor._count?.worshipRecords || 0}
                    </p>
                    <p className="text-xs text-ink-500">祭拜</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Worship Entry Card */}
            <Card className="card-ink border-vermilion-200">
              <CardHeader className="border-b border-vermilion-100">
                <CardTitle className="text-lg font-serif text-vermilion-700 flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  祭拜先祖
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-ink-600 mb-4 font-serif leading-relaxed">
                  点燃香烛，献上供品，表达您对{ancestor.firstName}先祖的思念与敬意。
                </p>
                <Link
                  href={`/ancestors/${id}/worship`}
                  className="btn-vermilion w-full flex items-center justify-center gap-2"
                >
                  <Flame className="h-4 w-4" />
                  开始祭拜
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Bio & Photos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Biography Card */}
            {ancestor.bio && (
              <Card className="card-ink">
                <CardHeader className="border-b border-paper-300">
                  <CardTitle className="text-lg font-serif text-ink-800">
                    生平简介
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-ink-700 font-serif leading-relaxed whitespace-pre-wrap">
                    {ancestor.bio}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Photos Section */}
            <Card className="card-ink">
              <CardHeader className="border-b border-paper-300">
                <CardTitle className="text-lg font-serif text-ink-800 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-ink-500" />
                  照片相册
                  <span className="text-sm text-ink-400">
                    ({photos.length}张)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {photos.length > 0 ? (
                  <div className="space-y-4">
                    {/* Main Photo Display */}
                    <div className="relative aspect-video bg-paper-200 rounded-lg overflow-hidden">
                    <Image
                        src={photos[currentPhotoIndex].imageUrl}
                        alt={`${photos[currentPhotoIndex].title} - 先祖照片`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
                        className="object-contain"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URLS.light}
                        priority={currentPhotoIndex === 0}
                      />
                      {/* Photo Navigation */}
                      {photos.length > 1 && (
                        <>
                          <button
                            onClick={goToPreviousPhoto}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-ink-900/50 text-white hover:bg-ink-900/70 transition-colors"
                            aria-label="上一张"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={goToNextPhoto}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-ink-900/50 text-white hover:bg-ink-900/70 transition-colors"
                            aria-label="下一张"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Photo Info */}
                    <div className="text-center">
                      <h4 className="font-serif text-ink-800">
                        {photos[currentPhotoIndex].title}
                      </h4>
                      {photos[currentPhotoIndex].description && (
                        <p className="text-sm text-ink-500 mt-1">
                          {photos[currentPhotoIndex].description}
                        </p>
                      )}
                      <p className="text-xs text-ink-400 mt-2">
                        上传者: {photos[currentPhotoIndex].uploader.name} ·
                        {new Date(
                          photos[currentPhotoIndex].uploadedAt
                        ).toLocaleDateString("zh-CN")}
                      </p>
                    </div>

                    {/* Photo Thumbnails */}
                    {photos.length > 1 && (
                      <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                        {photos.map((photo, index) => (
                          <button
                            key={photo.id}
                            onClick={() => setCurrentPhotoIndex(index)}
                            className={cn(
                              "relative w-16 h-16 rounded overflow-hidden border-2 transition-all",
                              index === currentPhotoIndex
                                ? "border-vermilion-500 ring-2 ring-vermilion-200"
                                : "border-transparent opacity-60 hover:opacity-100"
                            )}
                            aria-label={`查看${photo.title}`}
                          >
                            <Image
                              src={photo.imageUrl}
                              alt={`${photo.title} - 缩略图`}
                              fill
                              sizes="64px"
                              className="object-cover"
                              placeholder="blur"
                              blurDataURL={BLUR_DATA_URLS.light}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-ink-300" />
                    <p className="text-ink-500 font-serif mb-4">
                      暂无照片
                    </p>
                    <p className="text-sm text-ink-400 mb-6">
                      上传照片，记录先祖的音容笑貌
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photo Upload Section (for editors) */}
            <Card className="card-ink">
              <CardHeader className="border-b border-paper-300">
                <CardTitle className="text-lg font-serif text-ink-800">
                  上传照片
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <PhotoUpload
                  aspectRatio={4 / 3}
                  placeholder="点击或拖拽上传先祖照片"
                  onChange={(file, previewUrl) => {
                    // Handle photo upload - this would integrate with the upload API
                    console.log("Photo selected:", file, previewUrl)
                  }}
                />
                <p className="text-xs text-ink-400 mt-2 text-center">
                  支持 JPG、PNG、WebP 格式，最大 10MB
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
