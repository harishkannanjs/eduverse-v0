// components/dashboard-layout.tsx

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getCurrentUser, logout, type User } from "@/lib/auth-client"
import { LogOut, Settings, UserIcon, MessageSquare, Brain, Calendar, Heart, GraduationCap } from "lucide-react"
import { AIChat } from "@/components/ai-chat"
import { TaskReminder } from "@/components/task-reminder"
import Link from "next/link"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/")
      } else {
        setUser(currentUser)
      }
    }
    fetchUser()
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${user.role}/dashboard`}>
              <h1 className="text-2xl font-bold text-primary">EduVerse</h1>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/ai-insights")}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              AI Insights
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/communication")}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Messages
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/calendar")}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Calendar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/quiz")} className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Quiz
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/wellness")}
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              Wellness
            </Button>
            <span className="text-sm text-muted-foreground capitalize">{user.role} Dashboard</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 text-destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>

      {/* AI Chat - Available on all dashboards */}
      <AIChat />

      {/* Task Reminder notifications */}
      <TaskReminder />
    </div>
  )
}
