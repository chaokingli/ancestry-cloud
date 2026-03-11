"use client"

import { cn } from "@/lib"

/**
 * ShimmerPlaceholder Component
 * 
 * A CSS-only shimmer loading placeholder for images.
 * Follows ink-wash design system colors.
 */
export function ShimmerPlaceholder({
  className,
  aspectRatio = 4 / 3,
}: {
  className?: string
  aspectRatio?: number
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-paper-200",
        "before:absolute before:inset-0",
        "before:-translate-x-full",
        "before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r",
        "before:from-transparent",
        "before:via-paper-100/50",
        "before:to-transparent",
        className
      )}
      style={{ aspectRatio }}
    >
      {/* Inner decorative element for ink-wash style */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-paper-300/50" />
      </div>
    </div>
  )
}

/**
 * Generate a blur data URL for Next.js Image placeholder
 * Creates a simple base64 encoded SVG blur placeholder
 */
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10,
  color: string = "#f8f4e9"
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="${color}" filter="url(#blur)" />
    </svg>
  `
  // Convert to base64
  const base64 = typeof window === "undefined" 
    ? Buffer.from(svg).toString("base64")
    : window.btoa(svg)
  
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Predefined blur data URLs for common image sizes
 * These can be used directly without computation
 */
export const BLUR_DATA_URLS = {
  // Light paper color blur (for general images)
  light: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGZpbHRlciBpZD0iYmx1ciI+PGZlR2F1c3NpYW5CbHVyIGluPSJTb3VyY2VHcmFwaGljIiBzdGREZXZpYXRpb249IjIiIC8+PC9maWx0ZXI+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmOGY0ZTkiIGZpbHRlcj0idXJsKCNibHVyKSIgLz48L3N2Zz4=",
  // Ink color blur (for darker images)
  ink: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGZpbHRlciBpZD0iYmx1ciI+PGZlR2F1c3NpYW5CbHVyIGluPSJTb3VyY2VHcmFwaGljIiBzdGREZXZpYXRpb249IjIiIC8+PC9maWx0ZXI+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzNzQxNTEiIGZpbHRlcj0idXJsKCNibHVyKSIgLz48L3N2Zz4=",
  // Vermilion accent blur
  vermilion: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGZpbHRlciBpZD0iYmx1ciI+PGZlR2F1c3NpYW5CbHVyIGluPSJTb3VyY2VHcmFwaGljIiBzdGREZXZpYXRpb249IjIiIC8+PC9maWx0ZXI+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjNTNkMjUiIGZpbHRlcj0idXJsKCNibHVyKSIgLz48L3N2Zz4=",
}

export default ShimmerPlaceholder