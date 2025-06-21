// Simple client-side caching utility for prefetched data

const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function getCachedData(key: string): any | null {
  const cached = cache.get(key)
  if (!cached) return null

  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION
  if (isExpired) {
    cache.delete(key)
    return null
  }

  return cached.data
}

export function setCachedData(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  })
}

export function clearCache(): void {
  cache.clear()
}
