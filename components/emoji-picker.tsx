"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  isOpen: boolean
  onClose: () => void
}

const emojiCategories: Record<string, string[]> = {
  "Smileys & People": [ /* emojis */ ],
  "Animals & Nature": [ /* emojis */ ],
  "Food & Drink": [ /* emojis */ ],
  "Activities": [ /* emojis */ ],
  "Objects": [ /* emojis */ ]
}

export default function EmojiPicker({ onEmojiSelect, isOpen, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Smileys & People")

  if (!isOpen) return null

  return (
    <div className="absolute bottom-full right-0 mb-2 w-80 h-64 emoji-picker z-50 rounded-md shadow-lg bg-[#1a1a1a] border border-white/10">
      <div className="flex flex-col h-full z-50">
        {/* Category Tabs */}
        <div className="flex border-b border-white/10 p-2 gap-1 overflow-x-auto">
          {Object.keys(emojiCategories).map((category) => (
            <Button
              key={category}
              variant="ghost"
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={`text-xs whitespace-nowrap ${
                activeCategory === category
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-muted-foreground"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Emoji Grid */}
        <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-8 gap-2">
            {emojiCategories[activeCategory]?.map((emoji, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-violet-500/20 text-lg"
                onClick={() => {
                  onEmojiSelect(emoji)
                  onClose()
                }}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
