"use client"

import type React from "react"

import { useAuth } from "@/components/contexts/auth-context"
import { Loader2, Sparkles, Zap, Brain } from "lucide-react"
import SignInButton from "./sign-in-button"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950 dark:via-gray-900 dark:to-blue-950">
        <div className="text-center animate-fade-in-scale">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-2xl animate-pulse-glow">
           
            <Brain className="h-10 w-10 text-white" />
            {/* Uncomment the next line if you want to use Sparkles icon */}
            {/* <Sparkles className="h-10 w-10 text-white" /> */}
          </div>
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-violet-500" />
          <p className="text-muted-foreground font-medium">Loading Neuro Ai...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950 dark:via-gray-900 dark:to-blue-950 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>

          <div className="text-center max-w-md mx-auto p-8 relative z-10 animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-2xl animate-pulse-glow">
              <Sparkles className="h-12 w-12 text-white" />
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Welcome to <span className="gradient-text">Neuro Ai</span>
            </h1>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Your intelligent AI assistant powered by Google's Gemini. Sign in to start having amazing conversations.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="glass-card p-4 rounded-2xl">
                <Zap className="h-6 w-6 text-violet-400 mx-auto mb-2" />
                <p className="text-xs font-medium">Fast</p>
              </div>
              <div className="glass-card p-4 rounded-2xl">
                <Brain className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <p className="text-xs font-medium">Smart</p>
              </div>
              <div className="glass-card p-4 rounded-2xl">
                <Sparkles className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-medium">Creative</p>
              </div>
            </div>

            <SignInButton size="lg" className="w-full" />

            <p className="text-xs text-muted-foreground mt-6 opacity-70">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
