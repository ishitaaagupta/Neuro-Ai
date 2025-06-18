"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Mic,  Smile, MicOff, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useTheme } from "next-themes"

interface ChatInputProps {
  input: string
handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => void


  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  handleImageUpload?: (file: File) => void
}

export default function ChatInput({ input, handleInputChange, handleSubmit, isLoading, handleImageUpload }: ChatInputProps) {
  const [rows, setRows] = useState(1)
  const [isListening, setIsListening] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { theme } = useTheme()

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e)

    const textareaLineHeight = 24
    const minRows = 1
    const maxRows = 6

    const previousRows = e.target.rows
    e.target.rows = minRows

    const currentRows = Math.floor(e.target.scrollHeight / textareaLineHeight)

    if (currentRows === previousRows) {
      e.target.rows = currentRows
    }

    if (currentRows >= maxRows) {
      e.target.rows = maxRows
      e.target.scrollTop = e.target.scrollHeight
    }

    setRows(currentRows < maxRows ? currentRows : maxRows)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if ((input.trim() || selectedImage) && !isLoading) {
      if (selectedImage && handleImageUpload) {
        handleImageUpload(selectedImage)
      }
      handleSubmit(e)
      setRows(1)
      setSelectedImage(null)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit(e)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedImage(file)
        toast({
          title: "Image selected",
          description: `Selected ${file.name} for upload`,
        })
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file only",
          variant: "destructive",
        })
      }
    }
  }

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setIsListening(true)
        toast({
          title: "Listening...",
          description: "Speak now, I'm listening!",
        })
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        handleInputChange({ target: { value: input + transcript } } as React.ChangeEvent<HTMLTextAreaElement>)
      }

      recognition.onerror = () => {
        toast({
          title: "Voice input failed",
          description: "Could not access microphone or recognize speech",
          variant: "destructive",
        })
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input",
        variant: "destructive",
      })
    }
  }

  const handleEmojiSelect = (emoji: any) => {
    handleInputChange({ target: { value: input + emoji.native } } as React.ChangeEvent<HTMLTextAreaElement>)
    setShowEmojiPicker(false)
  }

  const removeSelectedImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="p-4 glass-card border-0 border-t border-white/10 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={onSubmit} className="relative">
          <div className="input-glass flex items-end gap-4 p-3 shadow-xl hover:shadow-2xl transition-all duration-300 border-white/20 hover:border-violet-400/50 rounded-xl">
            {/* Image upload button */}
            {/* <Button
              type="button"
              variant="ghost"
              size="icon"
              className="flex-shrink-0 btn-glass hover:bg-violet-500/20 hover:text-violet-400 transition-all duration-300 hover:scale-110 h-9 w-9"
              title="Upload image"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            /> */}

            {/* Text input */}
            <div className="flex-1 min-w-0">
              {selectedImage && (
                <div className="mb-2 p-2 bg-violet-500/10 rounded-lg text-sm text-violet-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* <div className="w-8 h-8 bg-violet-500/20 rounded-md flex items-center justify-center"> */}
                      {/* <ImageIcon className="h-4 w-4" /> */}
                    {/* </div> */}
                    <span className="truncate">{selectedImage.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-violet-500/20"
                    onClick={removeSelectedImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <textarea
                value={input}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                placeholder="Ask NeuroAI anything... ✨"
                rows={rows}
                className="w-full border-0 bg-transparent resize-none focus:ring-0 focus:outline-none p-0 min-h-[24px] max-h-[144px] placeholder:text-muted-foreground text-foreground text-[15px] leading-relaxed font-medium"
                disabled={isLoading}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`btn-glass transition-all duration-300 hover:scale-110 h-9 w-9 ${
                  isListening ? "bg-red-500/20 text-red-400" : "hover:bg-blue-500/20 hover:text-blue-400"
                }`}
                title="Voice input"
                onClick={handleVoiceInput}
                disabled={isLoading}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>

              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="btn-glass hover:bg-amber-500/20 hover:text-amber-400 transition-all duration-300 hover:scale-110 h-9 w-9"
                  title="Add emoji"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-4 w-4" />
                </Button>
                
                {showEmojiPicker && (
                  <div 
                    ref={emojiPickerRef}
                    className="absolute bottom-full right-0 mb-2 z-50"
                  >
                    <Picker 
                      data={data} 
                      onEmojiSelect={handleEmojiSelect}
                      theme={theme === 'dark' ? 'dark' : 'light'}
                      previewPosition="none"
                      skinTonePosition="none"
                    />
                  </div>
                )}
              </div>

              <Button
                type="submit"
                size="icon"
                disabled={(!input.trim() && !selectedImage) || isLoading}
                className="btn-gradient disabled:opacity-50 disabled:cursor-not-allowed h-9 w-9 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:hover:scale-100"
                title="Send message"
              >
                {isLoading ? (
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-2 opacity-70">
          NeuroAI can make mistakes. Please verify important information.
          <span className="text-violet-400 ml-1">Powered by Ishita</span>
        </p>
      </div>
    </div>
  )
}
