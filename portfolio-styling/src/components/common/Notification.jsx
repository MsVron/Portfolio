"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

const variantStyles = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-800 dark:text-green-200",
    iconColor: "text-green-500 dark:text-green-400",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/30",
    textColor: "text-destructive",
    iconColor: "text-destructive",
  },
  info: {
    icon: Info,
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    textColor: "text-primary",
    iconColor: "text-primary",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    textColor: "text-yellow-800 dark:text-yellow-200",
    iconColor: "text-yellow-500 dark:text-yellow-400",
  },
}

const Notification = ({ title, message, variant = "info", duration = 5000, onClose, show = true }) => {
  const [isVisible, setIsVisible] = useState(show)
  const style = variantStyles[variant] || variantStyles.info
  const Icon = style.icon

  useEffect(() => {
    setIsVisible(show)

    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  if (!isVisible) return null

  return (
    <div className={`rounded-md border p-4 ${style.bgColor} ${style.borderColor} ${style.textColor} shadow-sm`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${style.iconColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          {message && <div className="text-sm mt-1">{message}</div>}
        </div>
        {onClose && (
          <button
            type="button"
            className={`ml-auto flex-shrink-0 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.textColor} hover:bg-background/10`}
            onClick={() => {
              setIsVisible(false)
              onClose()
            }}
          >
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Notification
