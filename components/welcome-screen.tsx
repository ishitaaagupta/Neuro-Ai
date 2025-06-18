"use client"

import { Lightbulb, Code, Pen, Search, Brain } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface WelcomeScreenProps {
  userName: string
  onExampleClick: (text: string) => void
}

export default function WelcomeScreen({ userName, onExampleClick }: WelcomeScreenProps) {
  const examples = [
    {
      icon: Lightbulb,
      title: "Explain quantum computing",
      subtitle: "in simple terms with examples",
      prompt: "Explain quantum computing in simple terms with real-world examples",
      gradient: "from-amber-400 to-orange-500",
      bgGradient: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: Code,
      title: "Write a Python function",
      subtitle: "to solve complex algorithms",
      prompt: "Write a Python function to implement a binary search algorithm with comments",
      gradient: "from-emerald-400 to-teal-500",
      bgGradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      icon: Pen,
      title: "Help me write",
      subtitle: "professional content",
      prompt: "Help me write a professional email to request a meeting with my manager",
      gradient: "from-blue-400 to-indigo-500",
      bgGradient: "from-blue-500/20 to-indigo-500/20",
    },
    {
      icon: Search,
      title: "Research the latest",
      subtitle: "AI developments and trends",
      prompt: "Research and summarize the latest AI developments in 2024",
      gradient: "from-purple-400 to-pink-500",
      bgGradient: "from-purple-500/20 to-pink-500/20",
    },
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-8 overflow-y-auto custom-scrollbar relative z-0">
      
      {/* Background elements (z-[-1]) */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-violet-50/5 via-transparent to-blue-50/5 dark:from-violet-950/5 dark:via-transparent dark:to-blue-950/5" />
      <div className="absolute top-20 left-20 w-32 h-32 z-[-1] bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-40 h-40 z-[-1] bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      {/* Main content */}
      <div className="text-center relative z-10 animate-fade-in-up">
        {/* Logo and greeting */}
        <div className="mb-12 z-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-2xl animate-pulse-glow">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Hello, <span className="gradient-text">{userName}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-2">Welcome to NeuroAI</p>
          <p className="text-sm text-muted-foreground">Your personal AI assistant by Ishita</p>
        </div>

        {/* Example prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {examples.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-6 flex flex-col items-start text-left glass-card border-white/20 hover:border-violet-400/50 transition-all duration-300 transform hover:scale-[1.02] hover-lift animate-fade-in-up`}
              onClick={() => onExampleClick(example.prompt)}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${example.bgGradient} flex items-center justify-center mb-4`}
              >
                <example.icon
                  className={`h-6 w-6 bg-gradient-to-r ${example.gradient} bg-clip-text text-transparent`}
                />
              </div>
              <div>
                <div className="font-semibold mb-2 text-foreground">{example.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{example.subtitle}</div>
              </div>
            </Button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-8 opacity-70">
          Choose an example above or start typing your own question
        </p>
      </div>
    </div>
  )
}
