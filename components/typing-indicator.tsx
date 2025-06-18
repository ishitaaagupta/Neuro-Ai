"use client"

import { useState, useEffect } from "react"
import { Bot } from "lucide-react"

export default function TypingIndicator() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex gap-4 w-full mb-8 group animate-fade-in-scale">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse-glow">
        <Bot className="h-5 w-5 text-white" />
      </div>

      <div className="flex-1">
        <div className="chat-bubble-ai p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-foreground font-medium">NeuroAI is typing{dots}</span>
            <div className="loading-dots ml-2">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
