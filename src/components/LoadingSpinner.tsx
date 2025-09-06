import { useEffect, useState } from "react"

interface LoadingScreenProps {
  onComplete?: () => void
  duration?: number
}

export function LoadingScreen({ onComplete, duration = 3000 }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, duration)

    return () => clearTimeout(timeout)
  }, [duration, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="relative">
        <div
          className="w-12 h-12 rounded-full animate-spin border-4 border-transparent"
          style={{
            borderTopColor: "#10b981",
            borderRightColor: "#0891b2",
            borderBottomColor: "#10b981",
            borderLeftColor: "transparent",
          }}
        />
      </div>
    </div>
  )
}
