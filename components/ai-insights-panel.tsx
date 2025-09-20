"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, TrendingUp, AlertTriangle, Trophy, Lightbulb } from "lucide-react"
import { AIEngine, mockStudentPerformance, mockClassPerformances, type AIInsight } from "@/lib/ai-engine"

interface AIInsightsPanelProps {
  userRole: "student" | "teacher" | "parent"
  studentId?: string
}

export function AIInsightsPanel({ userRole, studentId }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate AI analysis
    const generateInsights = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let generatedInsights: AIInsight[] = []

      if (userRole === "student") {
        generatedInsights = AIEngine.analyzeStudentPerformance(mockStudentPerformance)

        // Add wellness recommendations
        const wellnessInsights = AIEngine.generateWellnessRecommendations(5, 6, 7)
        generatedInsights = [...generatedInsights, ...wellnessInsights]
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
            metadata: { classAnalysis },
          },
          ...classAnalysis.recommendations.map((rec, index) => ({
            id: `rec-${index}`,
            type: "recommendation" as const,
            title: "Teaching Recommendation",
            description: rec,
            priority: "medium" as const,
            actionable: true,
          })),
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
          metadata: { prediction },
        })
      }

      setInsights(generatedInsights)
      setIsLoading(false)
    }

    generateInsights()
  }, [userRole, studentId])

  const getInsightIcon = (type: string) => {
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

  const getInsightColor = (type: string, priority: string) => {
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" />
            AI Analysis in Progress
          </CardTitle>
          <CardDescription>Analyzing learning patterns and generating insights...</CardDescription>
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
        <CardDescription>Personalized insights powered by artificial intelligence</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
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
                  className={`p-4 rounded-lg border ${getInsightColor(insight.type, insight.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded">{getInsightIcon(insight.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        {getPriorityBadge(insight.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>

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

          <TabsContent value="recommendations" className="space-y-3">
            {insights
              .filter((insight) => insight.type === "recommendation")
              .map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border ${getInsightColor(insight.type, insight.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded">
                      <Lightbulb className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                      <Button size="sm" variant="outline">
                        Apply Recommendation
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-3">
            {insights
              .filter((insight) => insight.type === "alert")
              .map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border ${getInsightColor(insight.type, insight.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                      <Button size="sm" variant="outline">
                        Address Alert
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="trends" className="space-y-3">
            {insights
              .filter((insight) => insight.type === "trend")
              .map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border ${getInsightColor(insight.type, insight.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                      {insight.metadata?.classAnalysis && (
                        <div className="text-xs text-muted-foreground">
                          <p>Top Performers: {insight.metadata.classAnalysis.topPerformers.length}</p>
                          <p>Need Support: {insight.metadata.classAnalysis.strugglingStudents.length}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
