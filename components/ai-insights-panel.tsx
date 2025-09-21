"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Lightbulb,
  Heart,
  Target,
  Activity,
  Moon,
  Zap,
  Users,
  BookOpen,
} from "lucide-react"
import {
  AIEngine,
  mockStudentPerformance,
  mockClassPerformances,
  type AIInsight,
  type WellnessData,
} from "@/lib/ai-engine"

interface AIInsightsPanelProps {
  userRole: "student" | "teacher" | "parent"
  studentId?: string
}

export function AIInsightsPanel({ userRole, studentId }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [wellnessData, setWellnessData] = useState<WellnessData[]>([])

  useEffect(() => {
    // Load wellness data from localStorage or API
    const loadWellnessData = () => {
      const saved = localStorage.getItem("wellnessHistory")
      if (saved) {
        const parsed = JSON.parse(saved).map((data: any) => ({
          ...data,
          timestamp: new Date(data.timestamp),
        }))
        setWellnessData(parsed)
      } else {
        // Generate mock wellness data for demonstration
        const mockData: WellnessData[] = Array.from({ length: 7 }, (_, i) => ({
          stressLevel: Math.floor(Math.random() * 4) + 4 + i * 0.2, // Trending up slightly
          confidenceLevel: Math.floor(Math.random() * 3) + 6 - i * 0.1, // Trending down slightly
          focusLevel: Math.floor(Math.random() * 3) + 6,
          sleepHours: 6 + Math.random() * 2,
          exerciseMinutes: Math.floor(Math.random() * 60),
          socialInteraction: Math.floor(Math.random() * 4) + 5,
          moodRating: Math.floor(Math.random() * 3) + 6,
          studyEnvironment: ["quiet", "moderate", "noisy"][Math.floor(Math.random() * 3)] as any,
          motivationLevel: Math.floor(Math.random() * 3) + 6,
          timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
        }))
        setWellnessData(mockData)
        localStorage.setItem("wellnessHistory", JSON.stringify(mockData))
      }
    }

    loadWellnessData()
  }, [])

  useEffect(() => {
    // Generate AI insights
    const generateInsights = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let generatedInsights: AIInsight[] = []

      if (userRole === "student") {
        // Generate performance-based insights
        generatedInsights = AIEngine.analyzeStudentPerformance(mockStudentPerformance)

        // Add wellness-based insights
        if (wellnessData.length > 0) {
          const recentWellness = wellnessData.slice(-1)[0]
          const wellnessInsights = AIEngine.generateWellnessRecommendations(
            recentWellness.stressLevel,
            recentWellness.confidenceLevel,
            recentWellness.focusLevel,
            recentWellness,
          )
          generatedInsights = [...generatedInsights, ...wellnessInsights]

          // Add wellness-based insights using the enhanced method
          const mockProfile = {
            id: "student-1",
            name: "Current Student",
            subjects: ["Mathematics", "Science", "English"],
            learningStyle: "visual" as const,
            wellnessHistory: wellnessData,
            academicGoals: ["Improve math scores", "Better time management"],
            challenges: ["Test anxiety", "Procrastination"],
            preferences: {
              studyTime: "evening" as const,
              breakFrequency: 45,
              studyDuration: 90,
            },
          }

          const enhancedWellnessInsights = AIEngine.generateWellnessBasedInsights(
            mockProfile,
            wellnessData,
            mockStudentPerformance,
          )
          generatedInsights = [...generatedInsights, ...enhancedWellnessInsights]
        }
      } else if (userRole === "teacher") {
        const classAnalysis = AIEngine.analyzeClassPerformance(mockClassPerformances)

        generatedInsights = [
          {
            id: "class-performance",
            type: "trend",
            title: "Class Performance Overview",
            description: `Class average: ${Math.round(classAnalysis.classAverage)}%. ${classAnalysis.strugglingStudents.length} students need additional support.`,
            priority: "medium",
            actionable: true,
            metadata: { classAnalysis, category: "academic-overview" },
          },
          ...classAnalysis.recommendations.map((rec, index) => ({
            id: `rec-${index}`,
            type: "recommendation" as const,
            title: "Teaching Recommendation",
            description: rec,
            priority: "medium" as const,
            actionable: true,
            metadata: { category: "teaching-strategy" },
          })),
          // Add wellness-focused insights for teachers
          {
            id: "student-wellness-alert",
            type: "alert",
            title: "Student Wellness Monitoring",
            description:
              "3 students have reported high stress levels this week. Consider implementing stress-reduction activities or checking in individually.",
            priority: "high",
            actionable: true,
            metadata: { category: "student-wellness", affectedStudents: 3 },
          },
        ]
      } else if (userRole === "parent") {
        generatedInsights = AIEngine.analyzeStudentPerformance(mockStudentPerformance)

        // Add success prediction
        const prediction = AIEngine.predictStudentSuccess(mockStudentPerformance)
        generatedInsights.push({
          id: "success-prediction",
          type: "trend",
          title: "Success Prediction",
          description: `${Math.round(prediction.successProbability * 100)}% probability of continued success. ${prediction.riskFactors.length} risk factors identified.`,
          priority: prediction.successProbability > 0.7 ? "low" : "high",
          actionable: prediction.riskFactors.length > 0,
          metadata: { prediction, category: "academic-prediction" },
        })

        // Add parent-specific wellness insights
        if (wellnessData.length > 0) {
          const avgStress = wellnessData.slice(-7).reduce((sum, d) => sum + d.stressLevel, 0) / 7
          if (avgStress > 6) {
            generatedInsights.push({
              id: "parent-wellness-alert",
              type: "alert",
              title: "Child's Stress Levels Elevated",
              description: `Your child's stress levels have been above average (${avgStress.toFixed(1)}/10) this week. Consider discussing their workload and providing emotional support.`,
              priority: "high",
              actionable: true,
              metadata: { category: "parent-wellness", avgStress: avgStress.toFixed(1) },
            })
          }
        }
      }

      setInsights(generatedInsights)
      setIsLoading(false)
    }

    if (wellnessData.length > 0) {
      generateInsights()
    }
  }, [userRole, studentId, wellnessData])

  const getInsightIcon = (type: string, category?: string) => {
    if (category?.includes("wellness")) {
      return <Heart className="h-4 w-4" />
    }

    switch (type) {
      case "recommendation":
        return <Lightbulb className="h-4 w-4" />
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      case "achievement":
        return <Trophy className="h-4 w-4" />
      case "trend":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getInsightColor = (type: string, priority: string, category?: string) => {
    if (category?.includes("wellness")) {
      if (priority === "high") return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
      return "border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-950/20"
    }

    if (type === "alert" || priority === "high") return "border-destructive bg-destructive/5"
    if (type === "achievement") return "border-secondary bg-secondary/5"
    if (type === "trend") return "border-primary bg-primary/5"
    return "border-border bg-muted/20"
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="secondary">Medium Priority</Badge>
      case "low":
        return <Badge variant="outline">Low Priority</Badge>
      default:
        return null
    }
  }

  const getCategoryBadge = (category?: string) => {
    if (!category) return null

    const categoryMap: Record<string, { label: string; icon: any; variant: any }> = {
      wellness: { label: "Wellness", icon: Heart, variant: "outline" },
      "wellness-alert": { label: "Wellness Alert", icon: AlertTriangle, variant: "destructive" },
      "academic-wellness": { label: "Academic Wellness", icon: BookOpen, variant: "secondary" },
      "study-technique": { label: "Study Technique", icon: Target, variant: "outline" },
      "sleep-health": { label: "Sleep Health", icon: Moon, variant: "outline" },
      "physical-wellness": { label: "Physical Health", icon: Activity, variant: "outline" },
      "confidence-building": { label: "Confidence", icon: Zap, variant: "outline" },
      "teaching-strategy": { label: "Teaching", icon: Users, variant: "secondary" },
    }

    const config = categoryMap[category] || { label: category, icon: Brain, variant: "outline" }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getInsightsByCategory = (category: string) => {
    switch (category) {
      case "recommendations":
        return insights.filter((insight) => insight.type === "recommendation")
      case "alerts":
        return insights.filter((insight) => insight.type === "alert")
      case "trends":
        return insights.filter((insight) => insight.type === "trend")
      case "wellness":
        return insights.filter((insight) => insight.metadata?.category?.includes("wellness"))
      default:
        return insights
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" />
            AI Analysis in Progress
          </CardTitle>
          <CardDescription>Analyzing learning patterns and wellness data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Insights & Recommendations
        </CardTitle>
        <CardDescription>Personalized insights powered by AI, including wellness and academic data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {insights.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No insights available</h3>
                <p className="text-sm text-muted-foreground">
                  AI analysis will appear here as more data becomes available.
                </p>
              </div>
            ) : (
              insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border ${getInsightColor(insight.type, insight.priority, insight.metadata?.category)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded">{getInsightIcon(insight.type, insight.metadata?.category)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <div className="flex items-center gap-2">
                          {getCategoryBadge(insight.metadata?.category)}
                          {getPriorityBadge(insight.priority)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>

                      {insight.metadata?.stressLevel && (
                        <div className="mb-3 p-2 bg-muted/50 rounded text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span>Current Stress Level</span>
                            <span className="font-medium">{insight.metadata.stressLevel}/10</span>
                          </div>
                          <Progress value={Number.parseFloat(insight.metadata.stressLevel) * 10} className="h-1" />
                        </div>
                      )}

                      {insight.metadata?.techniques && (
                        <div className="mb-3">
                          <p className="text-xs font-medium mb-1">Recommended Techniques:</p>
                          <div className="flex flex-wrap gap-1">
                            {insight.metadata.techniques.map((technique: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {technique.replace(/_/g, " ")}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {insight.metadata?.prediction && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Success Probability</span>
                            <span className="font-medium">
                              {Math.round(insight.metadata.prediction.successProbability * 100)}%
                            </span>
                          </div>
                          <Progress value={insight.metadata.prediction.successProbability * 100} className="h-2" />
                        </div>
                      )}

                      {insight.actionable && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Take Action
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {["recommendations", "alerts", "trends", "wellness"].map((category) => (
            <TabsContent key={category} value={category} className="space-y-3">
              {getInsightsByCategory(category).length === 0 ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 text-muted-foreground mx-auto mb-4">
                    {category === "wellness" ? (
                      <Heart className="h-12 w-12" />
                    ) : category === "recommendations" ? (
                      <Lightbulb className="h-12 w-12" />
                    ) : category === "alerts" ? (
                      <AlertTriangle className="h-12 w-12" />
                    ) : (
                      <TrendingUp className="h-12 w-12" />
                    )}
                  </div>
                  <h3 className="font-medium mb-2">No {category} available</h3>
                  <p className="text-sm text-muted-foreground">
                    {category === "wellness"
                      ? "Wellness insights will appear as you log more wellness data."
                      : `${category.charAt(0).toUpperCase() + category.slice(1)} will appear here as more data becomes available.`}
                  </p>
                </div>
              ) : (
                getInsightsByCategory(category).map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${getInsightColor(insight.type, insight.priority, insight.metadata?.category)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded">{getInsightIcon(insight.type, insight.metadata?.category)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                          {getCategoryBadge(insight.metadata?.category)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>

                        {category === "wellness" && insight.metadata?.tips && (
                          <div className="mb-3">
                            <p className="text-xs font-medium mb-1">Tips:</p>
                            <div className="flex flex-wrap gap-1">
                              {insight.metadata.tips.map((tip: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tip.replace(/_/g, " ")}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {insight.actionable && (
                          <Button size="sm" variant="outline">
                            {category === "recommendations"
                              ? "Apply Recommendation"
                              : category === "alerts"
                                ? "Address Alert"
                                : category === "wellness"
                                  ? "Try Technique"
                                  : "View Details"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
