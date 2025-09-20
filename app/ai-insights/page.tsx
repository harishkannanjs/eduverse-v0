"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { getCurrentUser, type User } from "@/lib/auth"

export default function AIInsightsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
    } else {
      setUser(currentUser)
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout title="AI Insights">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-2">AI-Powered Learning Insights</h2>
          <p className="text-muted-foreground">
            Discover personalized recommendations and insights powered by artificial intelligence to enhance your
            learning experience.
          </p>
        </div>

        <AIInsightsPanel userRole={user.role} studentId={user.role === "student" ? user.id : undefined} />
      </div>
    </DashboardLayout>
  )
}
