"use client"
import { useParams } from "next/navigation"

export function useSlugParams() {
  const params = useParams<{ slug: string }>()
  return decodeURIComponent(params.slug)
}
