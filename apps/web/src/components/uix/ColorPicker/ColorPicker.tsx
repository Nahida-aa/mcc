import { useCallback, useEffect, useRef, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import type { HSB } from '@/lib/color-utils'
import { hsbToHex, hsbToRgb, hexToRgb, rgbToHsb } from '@/lib/color-utils'
import { SaturationBrightnessPanel } from './SaturationBrightnessPanel'
import { HueSlider } from './HueSlider'
import { PresetColors } from './PresetColors'

//   {value:hexInput, onChange:setHexInput}: {
//   value?: string,
//   onChange?: (hex: string) => void
// }
// #2e8ae6
export interface ColorPickerProps {
  /** Controlled hex value, e.g. "#3a8fd6" */
  value?: string | null
  /** Default hex value for uncontrolled mode */
  defaultValue?: string
  /** Called when the color changes, receives hex string */
  onChange?: (hex: string) => void
  /** Optional hidden input name for native form submission */
  name?: string
  /** Disabled state */
  disabled?: boolean
  /** Additional class names for the outer wrapper */
  className?: string
}

const DEFAULT_HSB: HSB = { h: 210, s: 80, b: 90 }

function hexToHsb(hex: string): HSB | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  return rgbToHsb(rgb)
}

export function ColorPicker({
  value,
  defaultValue,
  onChange,
  name,
  disabled = false,
  className,
}: ColorPickerProps) {
  // Determine if this is controlled or uncontrolled
  const isControlled = value !== undefined

  // Internal state for uncontrolled mode
  const [internalHsb, setInternalHsb] = useState<HSB>(() => {
    if (defaultValue) {
      return hexToHsb(defaultValue) ?? DEFAULT_HSB
    }
    return DEFAULT_HSB
  })

  // For controlled mode, derive HSB from the value prop
  // Use a ref to track the last controlled value to avoid unnecessary recalculations
  const lastControlledValue = useRef(value)
  const controlledHsb = useRef<HSB>(DEFAULT_HSB)

  if (isControlled && value !== lastControlledValue.current) {
    lastControlledValue.current = value
    controlledHsb.current = hexToHsb(value!) ?? DEFAULT_HSB
  }

  // Initialize controlled HSB on first render
  const initialized = useRef(false)
  if (isControlled && !initialized.current) {
    controlledHsb.current = hexToHsb(value!) ?? DEFAULT_HSB
    initialized.current = true
  }

  const hsb = isControlled ? controlledHsb.current : internalHsb

  const [hexInput, setHexInput] = useState('')
  const [copied, setCopied] = useState(false)

  const hex = hsbToHex(hsb)
  const rgb = hsbToRgb(hsb)

  // Sync hexInput when controlled value changes externally
  useEffect(() => {
    if (isControlled) {
      setHexInput('')
    }
  }, [isControlled]) // value,

  const handleHsbChange = useCallback(
    (newHsb: HSB) => {
      if (disabled) return
      const newHex = hsbToHex(newHsb)

      if (isControlled) {
        // In controlled mode, update the ref optimistically for smooth dragging
        controlledHsb.current = newHsb
        lastControlledValue.current = newHex
        onChange?.(newHex)
      } else {
        setInternalHsb(newHsb)
        onChange?.(newHex)
      }
      setHexInput('')
    },
    [disabled, isControlled, onChange],
  )

  const handleHexSubmit = useCallback(() => {
    if (disabled) return
    const cleaned = hexInput.startsWith('#') ? hexInput : `#${hexInput}`
    const parsed = hexToRgb(cleaned)
    if (parsed) {
      const newHsb = rgbToHsb(parsed)
      handleHsbChange(newHsb)
    }
    setHexInput('')
  }, [hexInput, disabled, handleHsbChange])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [hex])

  return (
    <div
      className={`flex flex-col gap-5 w-full max-w-xs rounded-xl  ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className ?? ''}`}
    >
      {/* Hidden input for native form submission */}
      {name && <input type="hidden" name={name} value={hex} />}

      {/* Saturation/Brightness Panel */}
      <SaturationBrightnessPanel hsb={hsb} onChange={handleHsbChange} />

      {/* Hue Slider */}
      <HueSlider hsb={hsb} onChange={handleHsbChange} />

      {/* Color Info */}
      <div className="flex items-center gap-3">
        {/* Color Preview */}
        <div
          className="h-10 w-10 shrink-0 rounded-lg border border-border shadow-inner"
          style={{ backgroundColor: hex }}
        />

        {/* Hex Input */}
        <div className="flex flex-1 items-center rounded-lg bg-muted px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground mr-1">HEX</span>
          <input
            type="text"
            className="flex-1 bg-transparent text-sm font-mono text-card-foreground outline-none placeholder:text-muted-foreground w-0"
            value={hexInput || hex}
            onChange={e => setHexInput(e.target.value)}
            onBlur={handleHexSubmit}
            onKeyDown={e => e.key === 'Enter' && handleHexSubmit()}
            disabled={disabled}
            aria-label="Hex color value"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="ml-1 text-muted-foreground hover:text-card-foreground transition-colors"
            aria-label="Copy hex value"
            disabled={disabled}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* RGB Values */}
      <div className="grid grid-cols-3 gap-2">
        {(['r', 'g', 'b'] as const).map(channel => (
          <div
            key={channel}
            className="flex flex-col items-center rounded-lg bg-muted px-2 py-1.5"
          >
            <span className="text-[10px] font-medium uppercase text-muted-foreground">
              {channel}
            </span>
            <span className="text-sm font-mono text-card-foreground">{rgb[channel]}</span>
          </div>
        ))}
      </div>

      {/* Presets */}
      <PresetColors onSelect={handleHsbChange} currentHex={hex} />
    </div>
  )
}
