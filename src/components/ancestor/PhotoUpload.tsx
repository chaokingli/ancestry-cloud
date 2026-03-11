"use client"

import * as React from "react"
import { useCallback, useState, useRef } from "react"
import Cropper, { Area } from "react-easy-crop"
import { cn } from "@/lib"
import { Button } from "@/components/ui/button"
import { Upload, X, Crop, Check, RotateCw, ZoomIn, ZoomOut } from "lucide-react"

// Constants
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Types
export interface PhotoUploadProps {
  value?: File | null
  onChange?: (file: File | null, previewUrl?: string) => void
  previewUrl?: string
  onPreviewChange?: (url: string | null) => void
  className?: string
  disabled?: boolean
  aspectRatio?: number
  maxSize?: number
  acceptedTypes?: string[]
  placeholder?: string
}

interface CropState {
  x: number
  y: number
  zoom: number
  rotation: number
  croppedAreaPixels: Area | null
}

/**
 * PhotoUpload Component
 * 
 * A drag-and-drop photo upload component with preview and cropping functionality.
 * Follows the ink-wash design system for traditional Chinese aesthetics.
 * 
 * Features:
 * - Drag and drop upload
 * - Click to upload
 * - Image preview
 * - Crop, rotate, and zoom functionality
 * - Ink-wash style UI
 * - Responsive design
 * - Error and loading states
 */
export function PhotoUpload({
  value,
  onChange,
  previewUrl,
  onPreviewChange,
  className,
  disabled = false,
  aspectRatio = 3 / 4, // Portrait aspect ratio for ancestor photos
  maxSize = MAX_FILE_SIZE,
  acceptedTypes = ACCEPTED_IMAGE_TYPES,
  placeholder = "拖拽照片到此处或点击上传",
}: PhotoUploadProps) {
  // State
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [cropState, setCropState] = useState<CropState>({
    x: 0,
    y: 0,
    zoom: 1,
    rotation: 0,
    croppedAreaPixels: null,
  })
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const fileReaderRef = useRef<FileReader | null>(null)

  // Internal preview state (used if onPreviewChange not provided)
  const [internalPreview, setInternalPreview] = useState<string | null>(null)
  const currentPreview = previewUrl ?? internalPreview

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `不支持的文件格式。请上传 ${acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join('、')} 格式的图片`
    }
    if (file.size > maxSize) {
      return `文件大小超出限制。最大允许 ${(maxSize / (1024 * 1024)).toFixed(0)}MB`
    }
    return null
  }, [acceptedTypes, maxSize])

  // Handle file selection
  const handleFile = useCallback((file: File) => {
    setError(null)
    
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    // Clean up previous file reader
    if (fileReaderRef.current) {
      fileReaderRef.current.abort()
    }

    const reader = new FileReader()
    fileReaderRef.current = reader

    reader.onload = (e) => {
      const result = e.target?.result as string
      setOriginalImage(result)
      setShowCropper(true)
      setIsLoading(false)
      // Reset crop state for new image
      setCropState({
        x: 0,
        y: 0,
        zoom: 1,
        rotation: 0,
        croppedAreaPixels: null,
      })
    }

    reader.onerror = () => {
      setError("读取文件失败，请重试")
      setIsLoading(false)
    }

    reader.readAsDataURL(file)
  }, [validateFile])

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
    // Reset input value to allow re-selecting the same file
    e.target.value = ""
  }, [handleFile])

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [disabled, handleFile])

  // Handle click
  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }, [disabled])

  // Handle remove
  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setError(null)
    setOriginalImage(null)
    setInternalPreview(null)
    onChange?.(null, undefined)
    onPreviewChange?.(null)
  }, [onChange, onPreviewChange])

  // Crop handlers
  const handleCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCropState(prev => ({ ...prev, croppedAreaPixels }))
  }, [])

  // Create cropped image
  const createCroppedImage = useCallback(async (): Promise<{ file: File; url: string } | null> => {
    if (!originalImage || !cropState.croppedAreaPixels) return null

    const image = new Image()
    image.src = originalImage

    await new Promise((resolve) => {
      image.onload = resolve
    })

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    const { x, y, width, height } = cropState.croppedAreaPixels
    
    // Calculate the actual dimensions after rotation
    const radians = (cropState.rotation * Math.PI) / 180
    const sin = Math.abs(Math.sin(radians))
    const cos = Math.abs(Math.cos(radians))
    const newWidth = width * cos + height * sin
    const newHeight = width * sin + height * cos

    canvas.width = width
    canvas.height = height

    // Apply transformations
    ctx.translate(width / 2, height / 2)
    ctx.rotate(radians)
    ctx.scale(cropState.zoom, cropState.zoom)
    ctx.translate(-image.width / 2, -image.height / 2)

    ctx.drawImage(image, 0, 0)

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null)
          return
        }
        const url = URL.createObjectURL(blob)
        const file = new File([blob], "cropped-photo.jpg", { type: "image/jpeg" })
        resolve({ file, url })
      }, "image/jpeg", 0.9)
    })
  }, [originalImage, cropState])

  // Handle crop confirm
  const handleCropConfirm = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await createCroppedImage()
      if (result) {
        setInternalPreview(result.url)
        onChange?.(result.file, result.url)
        onPreviewChange?.(result.url)
        setShowCropper(false)
        setOriginalImage(null)
      }
    } catch (err) {
      setError("裁剪图片失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }, [createCroppedImage, onChange, onPreviewChange])

  // Handle crop cancel
  const handleCropCancel = useCallback(() => {
    setShowCropper(false)
    setOriginalImage(null)
    setCropState({
      x: 0,
      y: 0,
      zoom: 1,
      rotation: 0,
      croppedAreaPixels: null,
    })
  }, [])

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setCropState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.1, 3) }))
  }, [])

  const handleZoomOut = useCallback(() => {
    setCropState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.1, 1) }))
  }, [])

  // Rotation control
  const handleRotate = useCallback(() => {
    setCropState(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))
  }, [])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (fileReaderRef.current) {
        fileReaderRef.current.abort()
      }
    }
  }, [])

  // Cropper Modal
  if (showCropper && originalImage) {
    return (
      <div className="fixed inset-0 z-50 bg-ink-900/95 flex flex-col">
        {/* Cropper Header */}
        <div className="flex items-center justify-between p-4 border-b border-ink-700">
          <h3 className="text-lg font-serif text-paper-100 tracking-wide">
            裁剪照片
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCropCancel}
            className="text-paper-300 hover:text-paper-100 hover:bg-ink-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cropper Area */}
        <div className="flex-1 relative bg-ink-800">
          <Cropper
            image={originalImage}
            crop={{ x: cropState.x, y: cropState.y }}
            zoom={cropState.zoom}
            rotation={cropState.rotation}
            aspect={aspectRatio}
            onCropChange={({ x, y }) => setCropState(prev => ({ ...prev, x, y }))}
            onZoomChange={(zoom) => setCropState(prev => ({ ...prev, zoom }))}
            onRotationChange={(rotation) => setCropState(prev => ({ ...prev, rotation }))}
            onCropComplete={handleCropComplete}
            cropShape="rect"
            showGrid={true}
            classes={{
              containerClassName: "bg-ink-800",
              mediaClassName: "object-contain",
              cropAreaClassName: "border-2 border-vermilion-500",
            }}
          />
        </div>

        {/* Cropper Controls */}
        <div className="p-4 bg-ink-800 border-t border-ink-700 space-y-4">
          {/* Zoom Slider */}
          <div className="flex items-center gap-4 px-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={cropState.zoom <= 1}
              className="text-paper-300 hover:text-paper-100"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={cropState.zoom}
              onChange={(e) => setCropState(prev => ({ ...prev, zoom: Number(e.target.value) }))}
              className="flex-1 h-2 bg-ink-600 rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-4
                         [&::-webkit-slider-thumb]:h-4
                         [&::-webkit-slider-thumb]:bg-vermilion-500
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={cropState.zoom >= 3}
              className="text-paper-300 hover:text-paper-100"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={handleRotate}
              className="flex-1 border-ink-600 text-paper-200 hover:bg-ink-700 hover:text-paper-100"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              旋转
            </Button>
            <Button
              variant="outline"
              onClick={handleCropCancel}
              className="flex-1 border-ink-600 text-paper-200 hover:bg-ink-700 hover:text-paper-100"
            >
              取消
            </Button>
            <Button
              onClick={handleCropConfirm}
              disabled={isLoading}
              className="flex-1 btn-vermilion"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-paper-100 border-t-transparent rounded-full" />
                  处理中...
                </span>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  确认
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Main Upload Component
  return (
    <div className={cn("relative", className)}>
      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
        aria-label="上传照片"
      />

      {/* Upload Area / Preview */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleClick()
          }
        }}
        className={cn(
          // Base styles
          "relative w-full overflow-hidden transition-all duration-200 cursor-pointer",
          "border-2 border-dashed rounded-md",
          // Ink-wash styling
          "bg-paper-50 hover:bg-paper-100",
          // Focus state
          "focus:outline-none focus:ring-2 focus:ring-ink-400 focus:ring-offset-2 focus:ring-offset-background",
          // Disabled state
          disabled && "opacity-50 cursor-not-allowed",
          // Drag state
          isDragging && "border-vermilion-500 bg-vermilion-50",
          // Error state
          error && "border-vermilion-400",
          // Default state
          !isDragging && !error && "border-paper-400 hover:border-ink-300"
        )}
        style={{ aspectRatio }}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-paper-100/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin h-8 w-8 border-2 border-ink-400 border-t-transparent rounded-full" />
              <span className="text-sm text-ink-600 font-serif">处理中...</span>
            </div>
          </div>
        )}

        {/* Preview Image */}
        {currentPreview && !isLoading ? (
          <div className="relative w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentPreview}
              alt="预览"
              className="w-full h-full object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-ink-900/0 hover:bg-ink-900/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClick()
                  }}
                  className="bg-paper-100 text-ink-800 hover:bg-paper-200"
                >
                  <Crop className="h-4 w-4 mr-1" />
                  重新裁剪
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="bg-vermilion-600 text-paper-100 hover:bg-vermilion-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  移除
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Upload Placeholder */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <Upload
              className={cn(
                "h-10 w-10 mb-3 transition-colors",
                isDragging ? "text-vermilion-500" : "text-ink-300"
              )}
            />
            <p className={cn(
              "text-sm font-serif transition-colors",
              isDragging ? "text-vermilion-600" : "text-ink-500"
            )}>
              {placeholder}
            </p>
            <p className="mt-2 text-xs text-ink-400">
              支持 {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join('、')} 格式，最大 {Math.floor(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-vermilion-50 border border-vermilion-200 rounded text-sm text-vermilion-700 font-serif">
          {error}
        </div>
      )}
    </div>
  )
}

export default PhotoUpload