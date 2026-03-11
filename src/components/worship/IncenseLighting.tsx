"use client"

import * as React from "react"

export interface IncenseLightingProps {
  /** Number of incense sticks (1-3) */
  count?: 1 | 2 | 3
  /** Whether the incense is actively burning */
  isBurning?: boolean
  /** Additional CSS classes */
  className?: string
  /** Callback when incense animation completes */
  onComplete?: () => void
}

/**
 * IncenseLighting Component - 上香动画组件
 * 
 * A reverent incense burning animation for virtual ancestor worship.
 * Features:
 * - Pure CSS animations for performance
 * - Realistic flame flicker effect
 * - Rising smoke particles with organic drift
 * - Reduced motion support for accessibility
 * - Ink-wash aesthetic integration
 * 
 * @example
 * <IncenseLighting count={3} isBurning={true} />
 */
export function IncenseLighting({
  count = 3,
  isBurning = true,
  className = "",
  onComplete,
}: IncenseLightingProps) {
  // Handle animation completion
  React.useEffect(() => {
    if (isBurning && onComplete) {
      const timer = setTimeout(() => {
        onComplete()
      }, 10000) // Animation completes after 10 seconds
      return () => clearTimeout(timer)
    }
  }, [isBurning, onComplete])

  const incenseSticks = Array.from({ length: count }, (_, i) => i)

  return (
    <div
      className={`incense-container ${className}`}
      role="img"
      aria-label={isBurning ? "香火燃烧中，烟雾袅袅上升" : "待上香"}
    >
      {/* Smoke particles layer - behind incense */}
      {isBurning && (
        <div className="smoke-layer" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`smoke-${i}`}
              className={`smoke-particle smoke-particle-${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Incense sticks holder/base */}
      <div className="incense-base" aria-hidden="true">
        <div className="incense-base-top" />
        <div className="incense-base-body" />
      </div>

      {/* Incense sticks */}
      <div className="incense-sticks">
        {incenseSticks.map((index) => (
          <div
            key={index}
            className={`incense-stick ${count === 2 ? "incense-stick-double" : ""} ${
              count === 3 ? "incense-stick-triple" : ""
            } incense-stick-pos-${index}`}
          >
            {/* Stick body */}
            <div className="stick-body" />
            
            {/* Burning tip with ash */}
            <div className="stick-tip">
              <div className="ash-layer" />
              
              {/* Flame - only visible when burning */}
              {isBurning && (
                <div className="flame-container">
                  <div className="flame flame-inner" />
                  <div className="flame flame-outer" />
                  <div className="flame flame-core" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Glow effect for burning incense */}
      {isBurning && (
        <div className="burning-glow" aria-hidden="true" />
      )}
    </div>
  )
}

export default IncenseLighting
