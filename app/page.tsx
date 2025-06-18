"use client"

import type React from "react"
import { useChat } from "ai/react"
import { useState, useEffect } from "react"
import ChatHeader from "@/components/chat-header"
import ChatMessages from "@/components/chat-messages"
import ChatInput from "@/components/chat-input"
import Sidebar from "@/components/sidebar"
import WelcomeScreen from "@/components/welcome-screen"
import AuthGuard from "@/components/auth/auth-guard"
import { useAuth } from "@/components/contexts/auth-context"
import type { Message } from "ai"

interface ChatHistory {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export default function ChatPage() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, reload } = useChat({
    api: "/api/chat",
    onFinish: () => {
      setTimeout(() => {
        saveChatToHistory()
      }, 100)
    },
  })

  const saveChatToHistory = () => {
    if (messages.length === 0) return

    const chatTitle = messages[0]?.content?.slice(0, 50) + "..." || "New Chat"
    const chatId = currentChatId || Date.now().toString()

    const newChat: ChatHistory = {
      id: chatId,
      title: chatTitle,
      messages: [...messages],
      createdAt: new Date(),
    }

    setChatHistory((prev) => {
      const existingIndex = prev.findIndex((chat) => chat.id === chatId)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = newChat
        return updated
      }
      return [newChat, ...prev]
    })

    if (!currentChatId) {
      setCurrentChatId(chatId)
    }
  }

  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      saveChatToHistory()
    }
  }, [messages, currentChatId])

  const handleNewChat = () => {
    setMessages([])
    setCurrentChatId(null)
    setShowWelcome(true)
  }

  const handleChatSelect = (chatId: string) => {
    const selectedChat = chatHistory.find((chat) => chat.id === chatId)
    if (selectedChat) {
      setMessages(selectedChat.messages)
      setCurrentChatId(chatId)
      setShowWelcome(false)
    }
  }

  const handleClearHistory = () => {
    setChatHistory([])
    setCurrentChatId(null)
    setMessages([])
    setShowWelcome(true)
  }

  const customHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      if (showWelcome) {
        setShowWelcome(false)
      }
      if (!currentChatId) {
        setCurrentChatId(Date.now().toString())
      }
      handleSubmit(e)
    }
  }
const handleExampleClick = (text: string) => {
  setShowWelcome(false)
  if (!currentChatId) {
    setCurrentChatId(Date.now().toString())
  }

  const mockEvent = {
    target: {
      value: text,
    },
  } as React.ChangeEvent<HTMLTextAreaElement>;

  handleInputChange(mockEvent);

  setTimeout(() => {
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    customHandleSubmit(syntheticEvent);
  }, 100);
};

  const handleRegenerate = () => {
    reload()
  }

  useEffect(() => {
    if (!user) return

    const savedHistory = localStorage.getItem(`chatHistory_${user.uid}`)
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setChatHistory(
          parsed.map((chat: any) => ({
            ...chat,
            createdAt: new Date(chat.createdAt),
          })),
        )
      } catch (error) {
        console.error("Failed to load chat history:", error)
      }
    }
  }, [user])

  useEffect(() => {
    if (chatHistory.length > 0 && user) {
      localStorage.setItem(`chatHistory_${user.uid}`, JSON.stringify(chatHistory))
    }
  }, [chatHistory, user])

  const showWelcomeScreen = messages.length === 0 && !isLoading && showWelcome

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar
          onNewChat={handleNewChat}
          currentChatId={currentChatId}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          chatHistory={chatHistory}
          onChatSelect={handleChatSelect}
          onClearHistory={handleClearHistory}
        />

        <div className="flex-1 flex flex-col min-w-0 h-screen">
          <ChatHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {showWelcomeScreen ? (
              <WelcomeScreen userName={user?.displayName || "User"} onExampleClick={handleExampleClick} />
            ) : (
              <ChatMessages
                messages={messages}
                isLoading={isLoading}
                onRegenerate={handleRegenerate}
              />
            )}
          </div>

          <div className="flex-shrink-0">
            <ChatInput
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={customHandleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
