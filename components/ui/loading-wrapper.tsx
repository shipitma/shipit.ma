import type React from "react"

interface LoadingWrapperProps {
  loading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LoadingWrapper({ loading, children, fallback }: LoadingWrapperProps) {
  if (loading) {
    return (
      fallback || (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      )
    )
  }

  return <>{children}</>
}
