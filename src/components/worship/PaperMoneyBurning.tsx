"use client"

import * as React from "react"

export type PaperMoneyType = "gold" | "silver" | "mixed"

export interface PaperMoneyBurningProps {
  /** Type of paper money to burn */
  type?: PaperMoneyType
  /** Whether the burning animation is active */
  isBurning?: boolean
  /** Amount of paper money (affects animation intensity) */
  amount?: "small" | "medium" | "large"
  /** Additional CSS classes */
  className?: string
  /** Callback when burning animation completes */
  onComplete?: () => void
  /** Callback when burning starts */
  onStart?: () => void
}

/**
 * PaperMoneyBurning Component - 烧纸钱动画组件
 *
 * A reverent paper money burning animation for virtual ancestor worship.
 * Features traditional Chinese joss paper (金纸/银纸) with realistic
 * flame and rising ash effects.
 *
 * Features:
 * - Pure CSS animations for performance
 * - Traditional gold/silver paper bars (元宝造型)
 * - Realistic flame flickering effect
 * - Rising ash particles with organic drift
 * - Reduced motion support for accessibility
 * - Ink-wash aesthetic integration
 *
 * @example
 * <PaperMoneyBurning type="gold" isBurning={true} amount="medium" />
 */
export function PaperMoneyBurning({
  type = "gold",
  isBurning = false,
  amount = "medium",
  className = "",
  onComplete,
  onStart,
}: PaperMoneyBurningProps) {
  const [burningState, setBurningState] = React.useState<"idle" | "igniting" | "burning" | "extinguishing">("idle")

  // Handle burning state changes
  React.useEffect(() => {
    if (isBurning && burningState === "idle") {
      setBurningState("igniting")
      onStart?.()

      // Transition to burning after ignition
      const igniteTimer = setTimeout(() => {
        setBurningState("burning")
      }, 500)

      return () => clearTimeout(igniteTimer)
    } else if (!isBurning && burningState !== "idle") {
      setBurningState("extinguishing")

      // Transition to idle after extinguishing
      const extinguishTimer = setTimeout(() => {
        setBurningState("idle")
      }, 800)

      return () => clearTimeout(extinguishTimer)
    }
  }, [isBurning, burningState, onStart])

  // Handle completion
  React.useEffect(() => {
    if (burningState === "burning" && onComplete) {
      const timer = setTimeout(() => {
        onComplete()
      }, 12000) // Animation completes after 12 seconds
      return () => clearTimeout(timer)
    }
  }, [burningState, onComplete])

  const getAmountConfig = () => {
    switch (amount) {
      case "small":
        return { stacks: 1, papers: 3, particles: 6 }
      case "large":
        return { stacks: 3, papers: 12, particles: 16 }
      default:
        return { stacks: 2, papers: 6, particles: 10 }
    }
  }

  const { stacks, particles } = getAmountConfig()
  const isActive = burningState === "igniting" || burningState === "burning"

  return (
    <div
      className={`paper-money-container ${className}`}
      role="img"
      aria-label={
        isBurning
          ? `正在焚烧${type === "gold" ? "金纸" : type === "silver" ? "银纸" : "金银纸"}，火焰燃烧中`
          : "纸钱待焚"
      }
    >
      {/* Background glow when burning */}
      {(burningState === "burning" || burningState === "extinguishing") && (
        <div className="burning-aura" aria-hidden="true" />
      )}

      {/* Ash particles layer */}
      {isActive && (
        <div className="ash-layer" aria-hidden="true">
          {Array.from({ length: particles }).map((_, i) => (
            <div
              key={`ash-${i}`}
              className={`ash-particle ash-particle-${(i % 8) + 1} ${type === "silver" ? "ash-silver" : type === "mixed" && i % 2 === 0 ? "ash-silver" : ""}`}
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      )}

      {/* Smoke effect */}
      {isActive && (
        <div className="paper-smoke-layer" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`smoke-${i}`}
              className={`paper-smoke smoke-${i + 1}`}
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          ))}
        </div>
      )}

      {/* Brazier/Fire pit base */}
      <div className="brazier-base" aria-hidden="true">
        <div className="brazier-rim" />
        <div className="brazier-body" />
        <div className="brazier-feet">
          <div className="brazier-foot" />
          <div className="brazier-foot" />
          <div className="brazier-foot" />
        </div>
      </div>

      {/* Paper money stacks */}
      <div className="paper-money-stacks">
        {Array.from({ length: stacks }).map((_, stackIndex) => (
          <div
            key={`stack-${stackIndex}`}
            className={`paper-stack ${isActive ? "paper-stack-burning" : ""}`}
            style={{
              animationDelay: `${stackIndex * 0.2}s`,
              opacity: isActive ? 1 - stackIndex * 0.15 : 1,
            }}
          >
            {Array.from({ length: 4 }).map((_, paperIndex) => (
              <div
                key={`paper-${stackIndex}-${paperIndex}`}
                className={`paper-bar ${type === "silver" ? "paper-silver" : type === "mixed" && (stackIndex + paperIndex) % 2 === 1 ? "paper-silver" : ""} ${isActive ? "paper-animated" : ""}`}
                style={{
                  animationDelay: `${stackIndex * 0.3 + paperIndex * 0.1}s`,
                }}
              >
                {/* Paper content - traditional ingot shape */}
                <div className="paper-content">
                  <div className="paper-emboss" />
                  <div className="paper-pattern">
                    <span className="paper-character">{type === "silver" ? "冥" : "寶"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Flames */}
      {(burningState === "igniting" || burningState === "burning" || burningState === "extinguishing") && (
        <div className="paper-flames" aria-hidden="true">
          <div className={`flame-base ${burningState === "extinguishing" ? "flame-dying" : ""}`}>
            <div className="flame-core" />
            <div className="flame-inner" />
            <div className="flame-outer" />
            <div className="flame-tips" />
          </div>
          {amount === "large" && (
            <>
              <div className={`flame-side flame-left ${burningState === "extinguishing" ? "flame-dying" : ""}`}>
                <div className="flame-inner" />
                <div className="flame-outer" />
              </div>
              <div className={`flame-side flame-right ${burningState === "extinguishing" ? "flame-dying" : ""}`}>
                <div className="flame-inner" />
                <div className="flame-outer" />
              </div>
            </>
          )}
        </div>
      )}

      {/* Spark particles */}
      {isActive && (
        <div className="spark-layer" aria-hidden="true">
          {Array.from({ length: amount === "large" ? 12 : 6 }).map((_, i) => (
            <div
              key={`spark-${i}`}
              className="spark-particle"
              style={{
                animationDelay: `${Math.random() * 2}s`,
                left: `${30 + Math.random() * 40}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Status indicator */}
      <div className="burning-status" role="status" aria-live="polite">
        {burningState === "idle" && <span className="status-text">准备就绪</span>}
        {burningState === "igniting" && <span className="status-text">点燃中...</span>}
        {burningState === "burning" && <span className="status-text">焚烧中</span>}
        {burningState === "extinguishing" && <span className="status-text">渐熄...</span>}
      </div>
    </div>
  )
}

export default PaperMoneyBurning
