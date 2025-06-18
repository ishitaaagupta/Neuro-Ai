"use client"

import { Menu, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import UserMenu from "@/components/auth/user-menu"

interface ChatHeaderProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
}

export default function ChatHeader({ isSidebarOpen, setIsSidebarOpen }: ChatHeaderProps) {
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <header className="glass-card border-0 border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="btn-glass hover:bg-white/10 md:hidden" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo and branding */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg animate-pulse-glow">
                <Brain className="h-5 w-5 text-white" />
              </div>
              {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div> */}
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl font-bold gradient-text">NeuroAI</h1>
              <p className="text-xs text-muted-foreground">Powered by Ishita</p>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
