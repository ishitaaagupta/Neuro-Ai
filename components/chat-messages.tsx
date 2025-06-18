"use client"

import { useEffect, useRef, useState } from "react"
import type { Message } from "ai"
import MessageBubble from "./message-bubble"
import TypingIndicator from "./typing-indicator"
import { ArrowDown } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  onRegenerate?: () => void
  imageAttachments?: Record<string, string>
}

export default function ChatMessages({ messages, isLoading, onRegenerate, imageAttachments = {} }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true)

  const scrollToBottom = () => {
    if (isAutoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100

    setShowScrollButton(isScrolledUp)
    setIsAutoScrollEnabled(!isScrolledUp)
  }

  const handleScrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setIsAutoScrollEnabled(true)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, imageAttachments])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll)
      return () => scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="flex-1 relative overflow-hidden h-full">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/10 via-transparent to-blue-50/10 dark:from-violet-950/10 dark:via-transparent dark:to-blue-950/10"></div>

      <div 
        ref={scrollContainerRef} 
        className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10"
      >
<div className="max-w-4xl mx-auto w-full px-6 py-8 space-y-8 min-h-[calc(100vh-200px)]">

          {messages.map((message, index) => (
            <div key={message.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <MessageBubble 
                message={message} 
                onRegenerate={message.role === 'assistant' ? onRegenerate : undefined} 
              />
            </div>
          ))}

          {isLoading && (
            <div className="animate-fade-in-scale">
              <TypingIndicator />
            </div>
          )}

          {/* Display image attachments before sending */}
          {Object.keys(imageAttachments).length > 0 && !isLoading && (
            <div className="flex justify-end mb-8 group">
              <div className="flex flex-col gap-2 max-w-[80%]">
                <div className="chat-bubble-user px-6 py-4 shadow-xl">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(imageAttachments).map(([key, url]) => (
                      <div key={key} className="relative">
                        <img 
                          src={url || "/placeholder.svg"} 
                          alt="Attachment" 
                          className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-8" />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (messages.length > 0 || isLoading) && (
        <Button
          onClick={handleScrollToBottom}
          className="absolute bottom-6 right-6 btn-glass hover:bg-white/20 rounded-full p-3 shadow-xl z-20 border border-white/20 hover-lift"
          size="icon"
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
