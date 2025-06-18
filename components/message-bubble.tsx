"use client"

import { useState } from "react"
import type { Message } from "ai"
import { ThumbsUp, ThumbsDown, RotateCcw, Share, Copy, User, Bot, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface MessageBubbleProps {
  message: Message
  onRegenerate?: () => void
  imageDataUrl?: string
}

export default function MessageBubble({ message, onRegenerate, imageDataUrl }: MessageBubbleProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [liked, setLiked] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"

  // Extract image information if present
  const hasImage = isUser && imageDataUrl && message.content.startsWith('[Image:')
  const textContent = hasImage 
    ? message.content.substring(message.content.indexOf(']') + 1).trim()
    : message.content

  const handleLike = () => {
    setLiked(liked === true ? null : true)
    toast({
      title: liked === true ? "Feedback removed" : "Thanks for your feedback!",
      description: liked === true ? "Your like has been removed." : "Your positive feedback helps improve NeuroAI.",
    })
  }

  const handleDislike = () => {
    setLiked(liked === false ? null : false)
    toast({
      title: liked === false ? "Feedback removed" : "Thanks for your feedback!",
      description: liked === false ? "Your dislike has been removed." : "Your feedback helps improve NeuroAI.",
    })
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      toast({
        title: "Copied to clipboard!",
        description: "The message has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the message to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "NeuroAI Conversation",
          text: message.content,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying
      handleCopy()
      toast({
        title: "Share not supported",
        description: "Message copied to clipboard instead.",
      })
    }
  }

  if (isUser) {
    return (
      <div className="flex justify-end mb-8 group">
        <div className="flex items-end gap-4 max-w-[80%]">
          <div className="chat-bubble-user px-6 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            {hasImage && (
              <div className="mb-3">
                <img 
                  src={imageDataUrl || "/placeholder.svg"} 
                  alt="Uploaded" 
                  className="max-w-full rounded-lg max-h-64 object-contain"
                />
              </div>
            )}
            {textContent && (
              <div className="whitespace-pre-wrap leading-relaxed text-white font-medium">{textContent}</div>
            )}
          </div>
          <Avatar className="h-10 w-10 ring-2 ring-violet-400/30 hover:ring-violet-400/50 transition-all duration-300 flex-shrink-0">
            <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold">
              {user?.displayName?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 mb-8 group">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 animate-pulse-glow">
        <Bot className="h-5 w-5 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="chat-bubble-ai p-6 mb-4 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
          <div className="text-foreground whitespace-pre-wrap break-words leading-relaxed text-[15px] font-medium">
            {message.content}
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 btn-glass transition-all duration-300 ${
              liked === true ? "bg-emerald-500/20 text-emerald-400" : "hover:bg-emerald-500/20 hover:text-emerald-400"
            }`}
            title="Good response"
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 btn-glass transition-all duration-300 ${
              liked === false ? "bg-red-500/20 text-red-400" : "hover:bg-red-500/20 hover:text-red-400"
            }`}
            title="Poor response"
            onClick={handleDislike}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 btn-glass hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300"
            title="Regenerate"
            onClick={onRegenerate}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 btn-glass transition-all duration-300 ${
              copied ? "bg-green-500/20 text-green-400" : "hover:bg-purple-500/20 hover:text-purple-400"
            }`}
            title="Copy"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 btn-glass hover:bg-amber-500/20 hover:text-amber-400 transition-all duration-300"
            title="Share"
            onClick={handleShare}
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
