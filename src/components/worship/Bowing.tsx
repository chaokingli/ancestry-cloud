"use client"

import * as React from "react"

export type BowingType = "kowtow" | "clasping" | "none"

export interface BowingProps {
  /** Type of bowing action */
  type?: BowingType
  /** Whether the animation is currently playing */
  isAnimating?: boolean
  /** Number of bows to perform (default 3 for kowtow, 1 for clasping) */
  count?: number
  /** Additional CSS classes */
  className?: string
  /** Callback when bowing animation completes */
  onComplete?: () => void
  /** Callback when bowing action is performed (each bow) */
  onBowingAction?: (currentCount: number) => void
}

/**
 * Bowing Component - 跪拜/作揖动画组件
 * 
 * A reverent bowing animation for virtual ancestor worship.
 * Features:
 * - Pure CSS animations for performance
 * - Traditional Chinese kowtow (磕头) animation with kneeling and deep bowing
 * - Traditional Chinese clasping (作揖) animation with hand gestures
 * - Reduced motion support for accessibility
 * - Ink-wash aesthetic integration
 * 
 * @example
 * <Bowing type="kowtow" isAnimating={true} count={3} />
 * <Bowing type="clasping" isAnimating={true} count={1} />
 */
export function Bowing({
  type = "none",
  isAnimating = false,
  count,
  className = "",
  onComplete,
  onBowingAction,
}: BowingProps) {
  const [currentBows, setCurrentBows] = React.useState(0)
  const [bowingPhase, setBowingPhase] = React.useState<"idle" | "bowing" | "rising">("idle")
  
  // Default counts based on type
  const bowCount = count ?? (type === "kowtow" ? 3 : 1)
  
  // Reset state when animation stops
  React.useEffect(() => {
    if (!isAnimating) {
      setCurrentBows(0)
      setBowingPhase("idle")
    }
  }, [isAnimating])
  
  // Handle bowing animation completion
  React.useEffect(() => {
    if (isAnimating && currentBows >= bowCount) {
      const timer = setTimeout(() => {
        onComplete?.()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isAnimating, currentBows, bowCount, onComplete])
  
  // Handle bowing cycle
  React.useEffect(() => {
    if (!isAnimating || currentBows >= bowCount) return
    
    // Kowtow animation cycle
    if (type === "kowtow") {
      const cycleDuration = 2500 // ms per bow
      const bowingTime = 800 // time spent bowed
      
      setBowingPhase("bowing")
      onBowingAction?.(currentBows + 1)
      
      const bowingTimer = setTimeout(() => {
        setBowingPhase("rising")
        
        const risingTimer = setTimeout(() => {
          setCurrentBows(prev => prev + 1)
          setBowingPhase("idle")
        }, cycleDuration - bowingTime)
        
        return () => clearTimeout(risingTimer)
      }, bowingTime)
      
      return () => clearTimeout(bowingTimer)
    }
    
    // Clasping animation cycle
    if (type === "clasping") {
      const cycleDuration = 2000 // ms per bow
      const bowingTime = 600 // time spent bowed
      
      setBowingPhase("bowing")
      onBowingAction?.(currentBows + 1)
      
      const bowingTimer = setTimeout(() => {
        setBowingPhase("rising")
        
        const risingTimer = setTimeout(() => {
          setCurrentBows(prev => prev + 1)
          setBowingPhase("idle")
        }, cycleDuration - bowingTime)
        
        return () => clearTimeout(risingTimer)
      }, bowingTime)
      
      return () => clearTimeout(bowingTimer)
    }
  }, [isAnimating, currentBows, bowCount, type, onBowingAction])

  const getAnimationState = () => {
    if (!isAnimating || type === "none") return "idle"
    return bowingPhase
  }

  const state = getAnimationState()
  const isKowtow = type === "kowtow"
  const isClasping = type === "clasping"

  return (
    <div
      className={`bowing-container ${className}`}
      role="img"
      aria-label={
        isAnimating
          ? isKowtow
            ? `正在行${bowCount}叩首礼，第${currentBows + 1}次`
            : `正在行${bowCount}次作揖礼，第${currentBows + 1}次`
          : "祭拜仪式"
      }
    >
      {/* Background mat/kneeling cushion */}
      <div className="bowing-mat" aria-hidden="true">
        <div className="mat-surface" />
      </div>

      {/* Character SVG */}
      <div 
        className={`bowing-character ${isKowtow ? 'bowing-kowtow' : ''} ${isClasping ? 'bowing-clasping' : ''} bowing-state-${state}`}
        aria-hidden="true"
      >
        <svg 
          viewBox="0 0 200 240" 
          className="character-svg"
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            {/* Ink gradient for clothing */}
            <linearGradient id="robeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#262626" />
              <stop offset="50%" stopColor="#404040" />
              <stop offset="100%" stopColor="#262626" />
            </linearGradient>
            
            {/* Skin gradient */}
            <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5d0c5" />
              <stop offset="100%" stopColor="#e8b4a8" />
            </linearGradient>
            
            {/* Vermilion accent for sash */}
            <linearGradient id="sashGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9c3d26" />
              <stop offset="50%" stopColor="#b9452b" />
              <stop offset="100%" stopColor="#9c3d26" />
            </linearGradient>

            {/* Shadow filter */}
            <filter id="inkShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="1" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Kowtow Pose - Kneeling figure */}
          {isKowtow && (
            <g className="character-group kowtow-group">
              {/* Robe body - back part */}
              <ellipse cx="100" cy="180" rx="55" ry="35" fill="url(#robeGradient)" opacity="0.8" />
              
              {/* Legs folded under (robe) */}
              <path 
                d="M50 180 Q40 200 60 210 Q100 220 140 210 Q160 200 150 180" 
                fill="url(#robeGradient)"
                filter="url(#inkShadow)"
              />
              
              {/* Torso */}
              <path 
                d="M70 180 L75 120 Q100 115 125 120 L130 180 Z" 
                fill="url(#robeGradient)"
                filter="url(#inkShadow)"
              />
              
              {/* Arms reaching forward */}
              <path 
                d="M75 130 Q60 150 50 170 L60 175" 
                stroke="#262626" 
                strokeWidth="12" 
                strokeLinecap="round"
                fill="none"
              />
              <path 
                d="M125 130 Q140 150 150 170 L140 175" 
                stroke="#262626" 
                strokeWidth="12" 
                strokeLinecap="round"
                fill="none"
              />
              
              {/* Hands on ground */}
              <ellipse cx="55" cy="175" rx="10" ry="6" fill="url(#skinGradient)" />
              <ellipse cx="145" cy="175" rx="10" ry="6" fill="url(#skinGradient)" />
              
              {/* Head - position changes with bowing */}
              <g className="kowtow-head">
                <ellipse cx="100" cy="95" rx="25" ry="28" fill="url(#skinGradient)" />
                {/* Hair/topknot */}
                <ellipse cx="100" cy="82" rx="22" ry="10" fill="#1a1a1a" />
                <circle cx="100" cy="78" r="6" fill="#1a1a1a" />
                {/* Face details */}
                <ellipse cx="93" cy="95" rx="3" ry="2" fill="#404040" opacity="0.5" />
                <ellipse cx="107" cy="95" rx="3" ry="2" fill="#404040" opacity="0.5" />
              </g>
              
              {/* Vermilion sash */}
              <path 
                d="M72 150 Q100 155 128 150" 
                stroke="url(#sashGradient)" 
                strokeWidth="6" 
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* Clasping Pose - Standing figure */}
          {isClasping && (
            <g className="character-group clasping-group">
              {/* Robe body */}
              <path 
                d="M60 200 Q55 160 65 120 Q100 110 135 120 Q145 160 140 200 Q100 210 60 200" 
                fill="url(#robeGradient)"
                filter="url(#inkShadow)"
              />
              
              {/* Legs */}
              <path 
                d="M70 200 L70 220 Q85 225 95 220 L95 200" 
                fill="url(#robeGradient)"
              />
              <path 
                d="M105 200 L105 220 Q115 225 130 220 L130 200" 
                fill="url(#robeGradient)"
              />
              
              {/* Arms in clasping position */}
              <path 
                d="M70 125 Q60 145 80 140" 
                stroke="#262626" 
                strokeWidth="10" 
                strokeLinecap="round"
                fill="none"
              />
              <path 
                d="M130 125 Q140 145 120 140" 
                stroke="#262626" 
                strokeWidth="10" 
                strokeLinecap="round"
                fill="none"
              />
              
              {/* Clasped hands at chest */}
              <g className="clasping-hands">
                <ellipse cx="92" cy="135" rx="8" ry="12" fill="url(#skinGradient)" transform="rotate(-20 92 135)" />
                <ellipse cx="108" cy="135" rx="8" ry="12" fill="url(#skinGradient)" transform="rotate(20 108 135)" />
                {/* Hands clasped together */}
                <rect x="95" y="128" width="10" height="16" rx="3" fill="url(#skinGradient)" />
              </g>
              
              {/* Head */}
              <g className="clasping-head">
                <ellipse cx="100" cy="95" rx="26" ry="30" fill="url(#skinGradient)" />
                {/* Hair/topknot */}
                <ellipse cx="100" cy="80" rx="24" ry="12" fill="#1a1a1a" />
                <circle cx="100" cy="76" r="7" fill="#1a1a1a" />
                {/* Face details */}
                <ellipse cx="92" cy="95" rx="3" ry="2" fill="#404040" opacity="0.5" />
                <ellipse cx="108" cy="95" rx="3" ry="2" fill="#404040" opacity="0.5" />
              </g>
              
              {/* Vermilion sash */}
              <path 
                d="M68 160 Q100 165 132 160" 
                stroke="url(#sashGradient)" 
                strokeWidth="6" 
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* Idle state - simple standing figure */}
          {type === "none" && (
            <g className="character-group idle-group">
              {/* Robe body */}
              <path 
                d="M60 200 Q55 160 65 120 Q100 110 135 120 Q145 160 140 200 Q100 210 60 200" 
                fill="url(#robeGradient)"
                opacity="0.6"
              />
              
              {/* Legs */}
              <path 
                d="M70 200 L70 220 Q85 225 95 220 L95 200" 
                fill="url(#robeGradient)"
                opacity="0.6"
              />
              <path 
                d="M105 200 L105 220 Q115 225 130 220 L130 200" 
                fill="url(#robeGradient)"
                opacity="0.6"
              />
              
              {/* Arms at sides */}
              <path 
                d="M68 125 L60 170" 
                stroke="#262626" 
                strokeWidth="10" 
                strokeLinecap="round"
                opacity="0.6"
              />
              <path 
                d="M132 125 L140 170" 
                stroke="#262626" 
                strokeWidth="10" 
                strokeLinecap="round"
                opacity="0.6"
              />
              
              {/* Head */}
              <ellipse cx="100" cy="95" rx="26" ry="30" fill="url(#skinGradient)" opacity="0.8" />
              <ellipse cx="100" cy="80" rx="24" ry="12" fill="#1a1a1a" opacity="0.8" />
            </g>
          )}
        </svg>
      </div>

      {/* Progress indicator */}
      {isAnimating && (
        <div className="bowing-progress" role="status" aria-live="polite">
          <span className="progress-text">
            第 {Math.min(currentBows + 1, bowCount)} / {bowCount} 次
          </span>
          <div className="progress-dots">
            {Array.from({ length: bowCount }).map((_, i) => (
              <span 
                key={i}
                className={`progress-dot ${i < currentBows ? 'completed' : i === currentBows && state === 'bowing' ? 'active' : ''}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      )}

      {/* Bow counter badge */}
      {!isAnimating && currentBows > 0 && (
        <div className="bowing-complete-badge" role="status">
          <span className="complete-text">
            {isKowtow ? `已行${currentBows}叩首礼` : `已行${currentBows}次作揖`}
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * BowingControl Component - 祭拜控制按钮组件
 * 
 * Control buttons for triggering bowing animations
 */
export interface BowingControlProps {
  /** Currently selected bowing type */
  selectedType?: BowingType
  /** Whether animation is currently playing */
  isAnimating?: boolean
  /** Callback when a bowing type is selected */
  onTypeSelect?: (type: BowingType) => void
  /** Callback when animation should start/stop */
  onAnimateToggle?: () => void
  /** Callback when animation should reset */
  onReset?: () => void
  /** Additional CSS classes */
  className?: string
}

export function BowingControl({
  selectedType = "none",
  isAnimating = false,
  onTypeSelect,
  onAnimateToggle,
  onReset,
  className = "",
}: BowingControlProps) {
  return (
    <div 
      className={`bowing-control ${className}`}
      role="group"
      aria-label="祭拜仪式控制"
    >
      {/* Type selection */}
      <div className="control-group type-selection" role="radiogroup" aria-label="选择祭拜方式">
        <button
          type="button"
          className={`control-btn ${selectedType === 'kowtow' ? 'active' : ''}`}
          onClick={() => onTypeSelect?.('kowtow')}
          disabled={isAnimating}
          aria-pressed={selectedType === 'kowtow'}
          aria-label="选择三叩首礼"
        >
          <span className="btn-icon" aria-hidden="true">🙇</span>
          <span className="btn-text">三叩首</span>
        </button>
        <button
          type="button"
          className={`control-btn ${selectedType === 'clasping' ? 'active' : ''}`}
          onClick={() => onTypeSelect?.('clasping')}
          disabled={isAnimating}
          aria-pressed={selectedType === 'clasping'}
          aria-label="选择作揖礼"
        >
          <span className="btn-icon" aria-hidden="true">🤝</span>
          <span className="btn-text">作揖</span>
        </button>
      </div>

      {/* Action buttons */}
      <div className="control-group action-buttons">
        <button
          type="button"
          className="action-btn btn-primary"
          onClick={onAnimateToggle}
          disabled={selectedType === 'none'}
          aria-label={isAnimating ? "停止祭拜" : "开始祭拜"}
        >
          <span className="btn-icon" aria-hidden="true">
            {isAnimating ? '⏸' : '▶'}
          </span>
          <span className="btn-text">
            {isAnimating ? '停止' : '开始祭拜'}
          </span>
        </button>
        <button
          type="button"
          className="action-btn btn-secondary"
          onClick={onReset}
          disabled={isAnimating}
          aria-label="重置祭拜"
        >
          <span className="btn-icon" aria-hidden="true">↺</span>
          <span className="btn-text">重置</span>
        </button>
      </div>
    </div>
  )
}

export default Bowing
