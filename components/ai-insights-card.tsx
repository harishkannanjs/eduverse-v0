"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, Target, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIInsightsCardProps {
  userId: string
  userRole: string
}

export function AIInsightsCard({ userId, userRole }: AIInsightsCardProps) {
  const [insights, setInsights] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
  const { toast } = useToast()

  const generateInsight = async (type: string) => {
    setLoading((prev) => ({ ...prev, [type]: true }))

    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setInsights((prev) => ({ ...prev, [type]: data.insight }))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI insights. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }))
    }
  }

  const insightTypes = [
    {
      key: "study_plan",
      title: "Study Plan",
      description: "Get a personalized study plan",
      icon: Target,
    },
    {
      key: "performance_analysis",
      title: "Performance Analysis",
      description: "Analyze your learning progress",
      icon: TrendingUp,
    },
    {
      key: "motivation",
      title: "Motivation Boost",
      description: "Get encouraging feedback",
      icon: Heart,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Insights
        </CardTitle>
        <CardDescription>Get personalized insights powered by AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insightTypes.map((type) => (
          <div key={type.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <type.icon className="h-4 w-4" />
                <span className="font-medium">{type.title}</span>
              </div>
              <Button size="sm" onClick={() => generateInsight(type.key)} disabled={loading[type.key]}>
                {loading[type.key] ? "Generating..." : "Generate"}
              </Button>
            </div>
            {insights[type.key] && <div className="p-3 bg-muted rounded-lg text-sm">{insights[type.key]}</div>}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
