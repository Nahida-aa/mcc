'use client'

import type { HSB } from '@/lib/color-utils'
import { hexToRgb, rgbToHsb } from '@/lib/color-utils'

interface PresetColorsProps {
  onSelect: (hsb: HSB) => void
  currentHex: string
}

const PRESETS = [
  { hex: '#fb2c36', name: 'Red' },
  { hex: '#f38ba8', name: 'lightRed' },
  { hex: '#eba0ac', name: 'Maroon' },
  { hex: '#f0c6c6', name: 'Flamingo' },
  { hex: '#f4dbd6', name: 'Rosewater' },
  { hex: '#ff6900', name: 'Orange' },
  { hex: '#fe9a00', name: 'amber' },
  { hex: '#f5a97f', name: 'Peach' },
  { hex: '#f0b100', name: 'Yellow' },
  { hex: '#f9e2af', name: 'lightYellow' },
  { hex: '#34C759', name: 'Green' },
  { hex: '#a6e3a1', name: 'lightGreen' },
  { hex: '#00bc7d', name: 'emerald' },
  { hex: '#00C7BE', name: 'Teal' },
  { hex: '#30B0C7', name: 'Cyan' },
  { hex: '#00a6f4', name: 'sky' },
  { hex: '#91d7e3', name: 'lightSky' },
  { hex: '#7dc4e4', name: 'Sapphire' },
  { hex: '#2b7fff', name: 'Blue' },
  { hex: '#8aadf4', name: 'lightBlue' },
  { hex: '#b7bdf8', name: 'Lavender' },
  { hex: '#615fff', name: 'Indigo' },
  { hex: '#c6a0f6', name: 'Mauve' },
  { hex: '#8e51ff', name: 'violet' },
  { hex: '#AF52DE', name: 'Purple' },
  { hex: '#e12afb', name: 'fuchsia' },
  { hex: '#f6339a', name: 'Pink' },
  { hex: '#f5bde6', name: 'lightPink' },
  { hex: '#ff2056', name: 'rose' },
  { hex: '#62748e', name: 'slate' },
  { hex: '#6a7282', name: 'Gray' },
  { hex: '#71717b', name: 'zinc' },
  { hex: '#737373', name: 'neutral' },
  { hex: '#79716b', name: 'stone' },
  { hex: '#FFFFFF', name: 'White' },
  { hex: '#1C1C1E', name: 'Dark' },
  { hex: '#A2845E', name: 'Brown' },
]

export function PresetColors({ onSelect, currentHex }: PresetColorsProps) {
  const handleSelect = (hex: string) => {
    const rgb = hexToRgb(hex)
    if (rgb) {
      onSelect(rgbToHsb(rgb))
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Presets
      </span>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(preset => {
          const isActive = currentHex.toUpperCase() === preset.hex.toUpperCase()
          return (
            <button
              key={preset.hex}
              type="button"
              className={`h-7 w-7 rounded-md border-2 transition-all duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive ? 'border-foreground scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: preset.hex }}
              onClick={() => handleSelect(preset.hex)}
              aria-label={preset.name}
              title={preset.name}
            />
          )
        })}
      </div>
    </div>
  )
}
