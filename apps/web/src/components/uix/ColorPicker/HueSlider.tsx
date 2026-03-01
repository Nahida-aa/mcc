'use client'

import React from 'react'

import { useCallback, useRef } from 'react'
import type { HSB } from '@/lib/color-utils'

interface HueSliderProps {
  hsb: HSB
  onChange: (hsb: HSB) => void
}

export function HueSlider({ hsb, onChange }: HueSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const updateHue = useCallback(
    (clientX: number) => {
      const slider = sliderRef.current
      if (!slider) return

      const rect = slider.getBoundingClientRect()
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
      const h = Math.round((x / rect.width) * 360)

      onChange({ ...hsb, h })
    },
    [hsb, onChange],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
      updateHue(e.clientX)
    },
    [updateHue],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return
      updateHue(e.clientX)
    },
    [updateHue],
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <div
      ref={sliderRef}
      className="relative h-3 w-full cursor-pointer rounded-full select-none touch-none"
      style={{
        background:
          'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="slider"
      aria-label="Hue"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={hsb.h}
      tabIndex={0}
    >
      {/* Thumb */}
      <div
        className="absolute top-1/2 pointer-events-none"
        style={{
          left: `${(hsb.h / 360) * 100}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="h-4 w-4 rounded-full border-2 border-foreground bg-foreground shadow-[0_0_4px_rgba(0,0,0,0.4)]"
          style={{ backgroundColor: `hsl(${hsb.h}, 100%, 50%)` }}
        />
      </div>
    </div>
  )
}
