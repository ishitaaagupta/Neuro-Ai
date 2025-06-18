"use client"

import { useState } from "react"
import { User, LogOut, Settings, UserIcon, Crown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { signOut } from "@/lib/auth"
import { useAuth } from "@/components/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function UserMenu() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
    } catch (error) {
      console.error("Sign out error:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-2xl btn-glass hover:bg-white/10 transition-all duration-300 hover:scale-110"
        >
          <Avatar className="h-10 w-10 ring-2 ring-violet-400/30 hover:ring-violet-400/50 transition-all duration-300">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 glass-card border-white/20 backdrop-blur-xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="h-6 w-6" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{user.displayName || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                <Badge variant="secondary" className="bg-violet-500/20 text-violet-300 border-violet-400/30 mt-1">
                  <Crown className="h-3 w-3 mr-1" />
                  Pro User
                </Badge>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 p-3">
          <User className="mr-3 h-4 w-4" />
          <span>Profile Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 p-3">
          <Zap className="mr-3 h-4 w-4" />
          <span>Usage & Billing</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 p-3">
          <Settings className="mr-3 h-4 w-4" />
          <span>Preferences</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          className="hover:bg-red-500/20 focus:bg-red-500/20 text-red-400 p-3"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
