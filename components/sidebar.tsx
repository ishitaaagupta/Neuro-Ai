"use client"

import { useState } from "react"
import {
  Search,
  PenSquare,
  Settings,
  ChevronDown,
  X,
  Menu,
  History,
  Trash2,
  Star,
  Brain,
  Moon,
  Sun,
  Monitor,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import type { Message } from "ai"

interface ChatHistory {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

interface SidebarProps {
  onNewChat: () => void
  currentChatId: string | null
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
  chatHistory: ChatHistory[]
  onChatSelect: (chatId: string) => void
  onClearHistory: () => void
}

export default function Sidebar({
  onNewChat,
  currentChatId,
  isSidebarOpen,
  setIsSidebarOpen,
  chatHistory,
  onChatSelect,
  onClearHistory,
}: SidebarProps) {
  const { user } = useAuth()
  const { setTheme, theme } = useTheme()
  const [showMore, setShowMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = chatHistory.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
  const visibleChats = showMore ? filteredChats : filteredChats.slice(0, 8)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in-scale"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          "sidebar-glass border-r border-white/10 flex flex-col transition-all duration-500 ease-in-out z-50 h-screen",
          "fixed md:sticky md:top-0",
          isSidebarOpen ? "w-80" : "w-16",
        )}
      >
        {/* Header */}
        <div className={cn("p-6 border-b border-white/10 backdrop-blur-xl flex-shrink-0", !isSidebarOpen && "px-3")}>
          {isSidebarOpen ? (
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL || "/placeholder.svg"}
                        alt={user.displayName || "User"}
                        className="w-8 h-8 rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {user?.displayName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <div>
                    {/* <h2 className="text-sm font-semibold text-foreground">Logged in:  {user?.displayName || "User"}</h2>
                    <p className="text-xs text-muted-foreground">AI Assistant</p> */}
                         <h2 className="text-sm font-semibold text-foreground">Neuro AI</h2>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="btn-glass hover:bg-white/10 h-8 w-8"
                  onClick={toggleSidebar}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-glass pl-12 border-white/20 focus:border-violet-400/50 focus:ring-violet-400/20 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* New Chat Button */}
              <Button
                onClick={onNewChat}
                className="w-full btn-gradient hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 transform hover:scale-[1.02] mb-6"
              >
                <PenSquare className="h-4 w-4 mr-3" />
                New Conversation
              </Button>
            </div>
          ) : (
            // Minimized header
            <div className="flex flex-col items-center space-y-4 animate-fade-in-scale">
              <Button
                variant="ghost"
                size="icon"
                className="btn-glass hover:bg-white/10 w-10 h-10"
                onClick={toggleSidebar}
                title="Expand sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <Button
                onClick={onNewChat}
                variant="ghost"
                size="icon"
                className="btn-glass hover:bg-white/10 w-10 h-10"
                title="New conversation"
              >
                <PenSquare className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Chat History */}
        {isSidebarOpen && (
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {filteredChats.length > 0 && (
              <div className="space-y-3 animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">Recent Chats</h3>
                    <Badge variant="secondary" className="bg-violet-500/20 text-violet-300 text-xs">
                      {filteredChats.length}
                    </Badge>
                  </div>
                  {chatHistory.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearHistory}
                      className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 px-2"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                {visibleChats.map((chat, index) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left h-auto py-4 px-4 rounded-2xl transition-all duration-300 group hover-lift",
                      currentChatId === chat.id
                        ? "glass-card border-violet-400/30 bg-violet-500/10 text-foreground shadow-lg"
                        : "hover:bg-white/5 text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => onChatSelect(chat.id)}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex flex-col items-start w-full overflow-hidden">
                        <span className="w-full truncate text-sm font-medium mb-1 group-hover:text-foreground transition-colors">
                          {chat.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{chat.createdAt.toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{chat.messages.length} messages</span>
                          {chat.messages.length > 10 && <Star className="h-3 w-3 text-amber-400" />}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}

                {filteredChats.length > 8 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMore(!showMore)}
                    className="w-full justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 mt-4 rounded-xl"
                  >
                    <ChevronDown
                      className={cn("h-4 w-4 mr-2 transition-transform duration-300", showMore && "rotate-180")}
                    />
                    {showMore ? "Show less" : `Show ${filteredChats.length - 8} more`}
                  </Button>
                )}
              </div>
            )}

            {filteredChats.length === 0 && chatHistory.length === 0 && (
              <div className="text-center text-muted-foreground text-sm mt-12 p-6 animate-fade-in-up">
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center animate-float">
                  <PenSquare className="h-10 w-10 text-violet-400" />
                </div>
                <h3 className="font-medium mb-2 text-foreground">No conversations yet</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Start a new conversation to begin your AI journey
                </p>
              </div>
            )}

            {filteredChats.length === 0 && chatHistory.length > 0 && (
              <div className="text-center text-muted-foreground text-sm mt-12 p-6 animate-fade-in-up">
                <Search className="h-12 w-12 mx-auto mb-4 text-violet-400" />
                <p className="font-medium">No conversations match your search</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        )}

        {/* Footer with Settings */}
        <div className={cn("p-6 border-t border-white/10 backdrop-blur-xl flex-shrink-0", !isSidebarOpen && "px-3")}>
          {isSidebarOpen ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-white/5 h-12 rounded-xl transition-all duration-300"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings & Help
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card border-white/20 backdrop-blur-xl w-56" align="end">
                <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-white/10 focus:bg-white/10">
                  <Sun className="h-4 w-4 mr-2" />
                  Light Theme
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-white/10 focus:bg-white/10">
                  <Moon className="h-4 w-4 mr-2" />
                  Dark Theme
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-white/10 focus:bg-white/10">
                  <Monitor className="h-4 w-4 mr-2" />
                  System Theme
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="btn-glass hover:bg-white/10 w-10 h-10"
                    title="Settings & Help"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-card border-white/20 backdrop-blur-xl" align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-white/10 focus:bg-white/10">
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-white/10 focus:bg-white/10">
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-white/10 focus:bg-white/10">
                    <Monitor className="h-4 w-4 mr-2" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
