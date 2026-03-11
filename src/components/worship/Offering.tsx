"use client"

import * as React from "react"

export type OfferingType = 
  | "apple" 
  | "orange" 
  | "peach" 
  | "tea" 
  | "wine" 
  | "rice" 
  | "dish"

export interface OfferingItem {
  /** Type of offering */
  type: OfferingType
  /** Custom label for the offering */
  label?: string
  /** Whether this offering is active/visible */
  isVisible?: boolean
}

export interface OfferingProps {
  /** Array of offerings to display (1-5 items) */
  offerings?: OfferingItem[]
  /** Whether to show the offering animation */
  isPresenting?: boolean
  /** Additional CSS classes */
  className?: string
  /** Callback when all offerings have animated in */
  onComplete?: () => void
  /** Callback when an individual offering is clicked */
  onOfferingClick?: (offering: OfferingItem, index: number) => void
}

const OFFERING_CONFIG: Record<OfferingType, { 
  label: string
  icon: React.ReactNode
  description: string
}> = {
  apple: {
    label: "苹果",
    description: "平安之果，寓意平安吉祥",
    icon: (
      <svg viewBox="0 0 48 48" className="offering-icon-svg" aria-hidden="true">
        {/* Apple body */}
        <ellipse cx="24" cy="28" rx="14" ry="16" fill="url(#appleGradient)" />
        {/* Apple highlight */}
        <ellipse cx="20" cy="22" rx="4" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(-15 20 22)" />
        {/* Stem */}
        <path d="M24 12 Q24 8 27 5" stroke="#5d4037" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Leaf */}
        <ellipse cx="28" cy="10" rx="4" ry="2" fill="#4caf50" transform="rotate(30 28 10)" />
        <defs>
          <linearGradient id="appleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e74c3c" />
            <stop offset="50%" stopColor="#c0392b" />
            <stop offset="100%" stopColor="#922b21" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  orange: {
    label: "柑橘",
    description: "大吉大利，寓意吉祥如意",
    icon: (
      <svg viewBox="0 0 48 48" className="offering-icon-svg" aria-hidden="true">
        {/* Orange body with segments visible */}
        <circle cx="24" cy="26" r="14" fill="url(#orangeGradient)" />
        {/* Segments */}
        <circle cx="24" cy="26" r="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="24" y1="14" x2="24" y2="38" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <line x1="12" y1="26" x2="36" y2="26" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        {/* Highlight */}
        <ellipse cx="18" cy="20" rx="3" ry="4" fill="rgba(255,255,255,0.25)" />
        {/* Leaf */}
        <ellipse cx="30" cy="12" rx="5" ry="2.5" fill="#2e7d32" transform="rotate(45 30 12)" />
        <path d="M30 12 Q28 8 26 10" stroke="#1b5e20" strokeWidth="1" fill="none" />
        <defs>
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f39c12" />
            <stop offset="50%" stopColor="#e67e22" />
            <stop offset="100%" stopColor="#d35400" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  peach: {
    label: "寿桃",
    description: "仙桃献寿，寓意长寿安康",
    icon: (
      <svg viewBox="0 0 48 48" className="offering-icon-svg" aria-hidden="true">
        {/* Peach body - heart shape */}
        <path 
          d="M24 42 C10 38 6 26 6 20 C6 14 12 10 18 12 C21 13 24 18 24 18 C24 18 27 13 30 12 C36 10 42 14 42 20 C42 26 38 38 24 42 Z" 
          fill="url(#peachGradient)" 
        />
        {/* Highlight */}
        <ellipse cx="16" cy="20" rx="3" ry="4" fill="rgba(255,255,255,0.3)" transform="rotate(-20 16 20)" />
        {/* Leaf */}
        <ellipse cx="30" cy="10" rx="5" ry="2" fill="#388e3c" transform="rotate(60 30 10)" />
        <defs>
          <linearGradient id="peachGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8bbd9" />
            <stop offset="40%" stopColor="#f48fb1" />
            <stop offset="100%" stopColor="#ec407a" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  tea: {
    label: "清茶",
    description: "敬茶一杯，表达敬意",
    icon: (
      <svg viewBox="0 0 48 48" className="offering-icon-svg" aria-hidden="true">
        {/* Teacup */}
        <path d="M12 16 L14 36 Q14 40 24 40 Q34 40 34 36 L36 16 Z" fill="url(#teaCupGradient)" />
        {/* Tea liquid */}
        <ellipse cx="24" cy="18" rx="10" ry="3" fill="#5d4037" />
        <ellipse cx="24" cy="19" rx="8" ry="2" fill="url(#teaGradient)" />
        {/* Handle */}
        <path d="M36 20 Q44 20 44 26 Q44 32 36 32" stroke="url(#teaCupGradient)" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Steam */}
        <path d="M20 10 Q22 6 20 4" stroke="rgba(128,128,128,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M24 12 Q26 7 24 4" stroke="rgba(128,128,128,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M28 10 Q30 6 28 4" stroke="rgba(128,128,128,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <defs>
          <linearGradient id="teaCupGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e8e8e8" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d4d4d4" />
          </linearGradient>
          <linearGradient id="teaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8d6e63" />
            <stop offset="100%" stopColor="#5d4037" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  wine: {
    label: "清酒",
    description: "敬酒一杯，缅怀先祖",
    icon: (
      <svg viewBox="0 0 48 48" className="offering-icon-svg" aria-hidden="true">
        {/* Wine cup - traditional Chinese cup */}
        <path d="M16 12 L18 32 Q18 38 24 38 Q30 38 30 32 L32 12 Z" fill="url(#wineCupGradient)" />
        {/* Wine liquid */}
        <path d="M17 20 L18 32 Q18 37 24 37 Q30 37 30 32 L31 20 Q24 22 17 20 Z" fill="url(#wineGradient)" />
        {/* Rim */}
        <ellipse cx="24" cy="12" rx="8" ry="2" fill="#d4d4d4" />
        <ellipse cx="24" cy="12" rx="6" ry="1.5" fill="#f5f5f5" />
        {/* Decoration */}
        <circle cx="24" cy="28" r="3" fill="none" stroke="#b8860b" strokeWidth="1" opacity="0.6" />
        <defs>
          <linearGradient id="wineCupGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c0c0c0" />
            <stop offset="50%" stopColor="#e8e8e8" />
            <stop offset="100%" stopColor="#a0a0a0" />
          </linearGradient>
          <linearGradient id="wineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4a574" />
            <stop offset="50%" stopColor="#c19a6b" />
            <stop offset="100%" stopColor="#a0826d" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  rice: {
    label: "米饭",
    description: "供饭一碗，不忘养育之恩",
    icon: (
      <svg viewBox="0 0 48 48" className="offering-icon-svg" aria-hidden="true">
        {/* Bowl */}
        <path d="M8 20 Q8 40 24 40 Q40 40 40 20 L8 20 Z" fill="url(#riceBowlGradient)" />
        {/* Bowl rim */}
        <ellipse cx="24" cy="20" rx="16" ry="4" fill="#e8e8e8" />
        <ellipse cx="24" cy="20" rx="14" ry="3" fill="#f5f5f5" />
        {/* Rice mound */}
        <ellipse cx="24" cy="19" rx="12" ry="3" fill="#ffffff" />
        <ellipse cx="24" cy="18" rx="10" ry="2.5" fill="#fafafa" />
        {/* Individual rice grains */}
        <circle cx="20" cy="18" r="0.8" fill="#e0e0e0" />
        <circle cx="24" cy="17" r="0.8" fill="#e0e0e0" />
        <circle cx="28" cy="18" r="0.8" fill="#e0e0e0" />
        <circle cx="22" cy="19" r="0.8" fill="#e0e0e0" />
        <circle cx="26" cy="19" r="0.8" fill="#e0e0e0" />
        {/* Base */}
        <ellipse cx="24" cy="38" rx="8" ry="2" fill="#b0b0b0" />
        <defs>
          <linearGradient id="riceBowlGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d0d0d0" />
            <stop offset="50%" stopColor="#f0f0f0" />
            <stop offset="100%" stopColor="#b8b8b8" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  dish: {
    label: "菜肴",
    description: "供奉菜肴，表达孝心",
    icon: (
      <svg viewBox="0 0 48 48" className="offering-icon-svg" aria-hidden="true">
        {/* Plate */}
        <ellipse cx="24" cy="30" rx="18" ry="6" fill="url(#plateGradient)" />
        <ellipse cx="24" cy="29" rx="14" ry="4" fill="#f5f5f5" />
        {/* Food items */}
        {/* Meat/vegetable 1 */}
        <ellipse cx="20" cy="28" rx="4" ry="2.5" fill="#8d6e63" />
        <ellipse cx="20" cy="27.5" rx="3" ry="1.5" fill="#a1887f" />
        {/* Meat/vegetable 2 */}
        <ellipse cx="28" cy="29" rx="3.5" ry="2" fill="#5d4037" />
        <ellipse cx="28" cy="28.5" rx="2.5" ry="1.2" fill="#795548" />
        {/* Green vegetable */}
        <ellipse cx="24" cy="30" rx="3" ry="1.5" fill="#4caf50" />
        {/* Garnish */}
        <circle cx="22" cy="27" r="1" fill="#e74c3c" opacity="0.8" />
        <circle cx="26" cy="28" r="0.8" fill="#ff9800" opacity="0.8" />
        <defs>
          <linearGradient id="plateGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c0c0c0" />
            <stop offset="50%" stopColor="#e8e8e8" />
            <stop offset="100%" stopColor="#a0a0a0" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
}

/**
 * Offering Component - 供奉动画组件
 * 
 * A reverent offering display component for virtual ancestor worship.
 * Features traditional Chinese offerings with elegant slide-in animations.
 * 
 * Features:
 * - Pure CSS animations for performance
 * - Traditional Chinese offerings (fruits, tea, wine, rice, dishes)
 * - Slide-in animation from bottom with staggered delays
 * - Reduced motion support for accessibility
 * - Ink-wash aesthetic integration
 * 
 * @example
 * <Offering 
 *   offerings={[
 *     { type: "apple" },
 *     { type: "tea" },
 *     { type: "rice" }
 *   ]} 
 *   isPresenting={true} 
 * />
 */
export function Offering({
  offerings = [],
  isPresenting = true,
  className = "",
  onComplete,
  onOfferingClick,
}: OfferingProps) {
  // Limit offerings to 5 maximum
  const displayOfferings = offerings.slice(0, 5)
  
  // Handle animation completion
  React.useEffect(() => {
    if (isPresenting && onComplete && displayOfferings.length > 0) {
      // Calculate total animation time based on last item
      const lastIndex = displayOfferings.length - 1
      const animationDuration = 600 // ms per item
      const staggerDelay = 150 // ms between items
      const totalTime = (lastIndex * staggerDelay) + animationDuration + 100
      
      const timer = setTimeout(() => {
        onComplete()
      }, totalTime)
      
      return () => clearTimeout(timer)
    }
  }, [isPresenting, onComplete, displayOfferings.length])

  // Get grid layout class based on offering count
  const getGridClass = (count: number) => {
    switch (count) {
      case 1: return "offering-grid-single"
      case 2: return "offering-grid-double"
      case 3: return "offering-grid-triple"
      case 4: return "offering-grid-quad"
      case 5: return "offering-grid-five"
      default: return "offering-grid-single"
    }
  }

  const gridClass = getGridClass(displayOfferings.length)

  return (
    <div 
      className={`offering-container ${className}`}
      role="region"
      aria-label="供奉祭品"
    >
      {/* Offering table/altar surface */}
      <div className="offering-altar" aria-hidden="true">
        <div className="altar-surface" />
      </div>

      {/* Offerings grid */}
      <div className={`offering-grid ${gridClass}`}>
        {displayOfferings.map((offering, index) => {
          const config = OFFERING_CONFIG[offering.type]
          const isVisible = offering.isVisible !== false
          const label = offering.label || config.label
          
          return (
            <div
              key={`${offering.type}-${index}`}
              className={`offering-item ${isPresenting && isVisible ? 'offering-item-animate' : ''} offering-item-pos-${index}`}
              style={{ 
                animationDelay: isPresenting && isVisible ? `${index * 0.15}s` : '0s',
              }}
              role="button"
              tabIndex={onOfferingClick ? 0 : -1}
              aria-label={`${label} - ${config.description}`}
              onClick={() => onOfferingClick?.(offering, index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onOfferingClick?.(offering, index)
                }
              }}
            >
              {/* Offering plate/dish */}
              <div className="offering-plate" aria-hidden="true">
                <div className="plate-inner" />
              </div>
              
              {/* Offering icon */}
              <div className="offering-icon">
                {config.icon}
              </div>
              
              {/* Offering label */}
              <span className="offering-label">{label}</span>
              
              {/* Glow effect for active offerings */}
              {isPresenting && isVisible && (
                <div className="offering-glow" aria-hidden="true" />
              )}
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {displayOfferings.length === 0 && (
        <div className="offering-empty" role="status" aria-label="暂无供品">
          <div className="offering-empty-icon" aria-hidden="true">🥢</div>
          <span className="offering-empty-text">请添加供品</span>
        </div>
      )}
    </div>
  )
}

export default Offering
