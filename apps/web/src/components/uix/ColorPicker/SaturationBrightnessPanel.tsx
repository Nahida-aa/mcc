'use client'

import React from 'react'

import { useCallback, useRef } from 'react'
import type { HSB } from '@/lib/color-utils'

interface SaturationBrightnessPanelProps {
  hsb: HSB
  onChange: (hsb: HSB) => void
}

export function SaturationBrightnessPanel({
  hsb,
  onChange,
}: SaturationBrightnessPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const updateColor = useCallback(
    (clientX: number, clientY: number) => {
      const panel = panelRef.current
      if (!panel) return

      const rect = panel.getBoundingClientRect()
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
      const y = Math.max(0, Math.min(clientY - rect.top, rect.height))

      const s = Math.round((x / rect.width) * 100)
      const b = Math.round((1 - y / rect.height) * 100)

      onChange({ ...hsb, s, b })
    },
    [hsb, onChange],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
      updateColor(e.clientX, e.clientY)
    },
    [updateColor],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return
      updateColor(e.clientX, e.clientY)
    },
    [updateColor],
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const hueColor = `hsl(${hsb.h}, 100%, 50%)`

  return (
    <div
      ref={panelRef}
      className="relative aspect-square w-full cursor-crosshair rounded-lg overflow-hidden select-none touch-none"
      style={{
        background: `
          linear-gradient(to top, #000, transparent),
          linear-gradient(to right, #fff, ${hueColor})
        `,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="slider"
      aria-label="Saturation and brightness"
      aria-valuetext={`Saturation ${hsb.s}%, Brightness ${hsb.b}%`}
      tabIndex={0}
    >
      {/* Indicator */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${hsb.s}%`,
          top: `${100 - hsb.b}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="h-4 w-4 rounded-full border-2 border-foreground shadow-[0_0_0_1px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(0,0,0,0.3)]" />
      </div>
    </div>
  )
}
