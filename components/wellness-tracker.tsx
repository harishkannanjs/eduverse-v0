"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, TrendingUp } from "lucide-react"
import type { WellnessData } from "@/lib/ai-engine"

interface WellnessTrackerProps {
  onDataSubmit?: (data: WellnessData) => void
}

export function WellnessTracker({ onDataSubmit }: WellnessTrackerProps) {
  const [currentData, setCurrentData] = useState<Partial<WellnessData>>({
    stressLevel: 5,
    confidenceLevel: 5,
    focusLevel: 5,
    sleepHours: 8,
    exerciseMinutes: 30,
    socialInteraction: 5,
    moodRating: 5,
    studyEnvironment: "quiet",
    motivationLevel: 5,
  })
  const [wellnessHistory, setWellnessHistory] = useState<WellnessData[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Load wellness history from localStorage
    const saved = localStorage.getItem("wellnessHistory")
    if (saved) {
      const parsed = JSON.parse(saved).map((data: any) => ({
        ...data,
        timestamp: new Date(data.timestamp),
      }))
      setWellnessHistory(parsed)
    }
  }, [])

  const submitWellnessData = async () => {
    setIsSubmitting(true)

    const completeData: WellnessData = {
      ...currentData,
      timestamp: new Date(),
    } as WellnessData

    const updatedHistory = [...wellnessHistory, completeData]
    setWellnessHistory(updatedHistory)
    localStorage.setItem("wellnessHistory", JSON.stringify(updatedHistory))

    onDataSubmit?.(completeData)

    // Reset form
    setCurrentData({
      stressLevel: 5,
      confidenceLevel: 5,
      focusLevel: 5,
      sleepHours: 8,
      exerciseMinutes: 30,
      socialInteraction: 5,
      moodRating: 5,
      studyEnvironment: "quiet",
      motivationLevel: 5,
    })

    setIsSubmitting(false)
  }

  const getRecentTrend = (key: keyof WellnessData) => {
    if (wellnessHistory.length < 2) return 0

    const recent = wellnessHistory.slice(-7) // Last 7 entries
    if (recent.length < 2) return 0

    const values = recent.map((d) => d[key] as number).filter((v) => typeof v === "number")
    if (values.length < 2) return 0

    const firstHalf = values.slice(0, Math.floor(values.length / 2))
    const secondHalf = values.slice(Math.floor(values.length / 2))

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length

    return secondAvg - firstAvg
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0.5) return "📈"
    if (trend < -0.5) return "📉"
    return "➡️"
  }

  const getWellnessScore = () => {
    const weights = {
      stressLevel: -1, // Lower stress is better
      confidenceLevel: 1,
      focusLevel: 1,
      moodRating: 1,
      motivationLevel: 1,
    }

    let score = 50 // Base score

    Object.entries(weights).forEach(([key, weight]) => {
      const value = currentData[key as keyof WellnessData] as number
      if (value !== undefined) {
        score += (value - 5) * weight * 5 // Scale to contribute ±25 points max
      }
    })

    return Math.max(0, Math.min(100, score))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Daily Wellness Check-in
          </CardTitle>
          <CardDescription>
            Track your daily wellness to get personalized AI insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Wellness Score */}
          <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Current Wellness Score</h4>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {Math.round(getWellnessScore())}/100
              </Badge>
            </div>
            <Progress value={getWellnessScore()} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              Based on your current responses. Higher scores indicate better overall wellness.
            </p>
          </div>

          {/* Wellness Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Stress Level</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{currentData.stressLevel}/10</span>
                    {wellnessHistory.length > 1 && (
                      <span className="text-xs">{getTrendIcon(getRecentTrend("stressLevel"))}</span>
                    )}
                  </div>
                </div>
                <Slider
                  value={[currentData.stressLevel || 5]}
                  onValueChange={(value) => setCurrentData((prev) => ({ ...prev, stressLevel: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Very Relaxed</span>
                  <span>Very Stressed</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Confidence Level</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{currentData.confidenceLevel}/10</span>
                    {wellnessHistory.length > 1 && (
                      <span className="text-xs">{getTrendIcon(getRecentTrend("confidenceLevel"))}</span>
                    )}
                  </div>
                </div>
                <Slider
                  value={[currentData.confidenceLevel || 5]}
                  onValueChange={(value) => setCurrentData((prev) => ({ ...prev, confidenceLevel: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Not Confident</span>
                  <span>Very Confident</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Focus Level</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{currentData.focusLevel}/10</span>
                    {wellnessHistory.length > 1 && (
                      <span className="text-xs">{getTrendIcon(getRecentTrend("focusLevel"))}</span>
                    )}
                  </div>
                </div>
                <Slider
                  value={[currentData.focusLevel || 5]}
                  onValueChange={(value) => setCurrentData((prev) => ({ ...prev, focusLevel: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Very Distracted</span>
                  <span>Very Focused</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Mood Rating</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{currentData.moodRating}/10</span>
                    {wellnessHistory.length > 1 && (
                      <span className="text-xs">{getTrendIcon(getRecentTrend("moodRating"))}</span>
                    )}
                  </div>
                </div>
                <Slider
                  value={[currentData.moodRating || 5]}
                  onValueChange={(value) => setCurrentData((prev) => ({ ...prev, moodRating: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Very Low</span>
                  <span>Very High</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Sleep Hours (last night)</Label>
                <Input
                  type="number"
                  min="0"
                  max="12"
                  step="0.5"
                  value={currentData.sleepHours || 8}
                  onChange={(e) =>
                    setCurrentData((prev) => ({ ...prev, sleepHours: Number.parseFloat(e.target.value) || 8 }))
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Exercise Minutes (today)</Label>
                <Input
                  type="number"
                  min="0"
                  max="300"
                  value={currentData.exerciseMinutes || 30}
                  onChange={(e) =>
                    setCurrentData((prev) => ({ ...prev, exerciseMinutes: Number.parseInt(e.target.value) || 30 }))
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Study Environment</Label>
                <Select
                  value={currentData.studyEnvironment || "quiet"}
                  onValueChange={(value: any) => setCurrentData((prev) => ({ ...prev, studyEnvironment: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiet">Quiet</SelectItem>
                    <SelectItem value="moderate">Moderate Noise</SelectItem>
                    <SelectItem value="noisy">Noisy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Social Interaction</Label>
                  <span className="text-sm">{currentData.socialInteraction}/10</span>
                </div>
                <Slider
                  value={[currentData.socialInteraction || 5]}
                  onValueChange={(value) => setCurrentData((prev) => ({ ...prev, socialInteraction: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Very Isolated</span>
                  <span>Very Social</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Motivation Level</Label>
                  <span className="text-sm">{currentData.motivationLevel}/10</span>
                </div>
                <Slider
                  value={[currentData.motivationLevel || 5]}
                  onValueChange={(value) => setCurrentData((prev) => ({ ...prev, motivationLevel: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Very Low</span>
                  <span>Very High</span>
                </div>
              </div>
            </div>
          </div>

          <Button onClick={submitWellnessData} disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 mr-2" />
                Submit Wellness Check-in
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Wellness History Summary */}
      {wellnessHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Wellness Trends
            </CardTitle>
            <CardDescription>Your wellness patterns over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["stressLevel", "confidenceLevel", "focusLevel", "moodRating"].map((metric) => {
                const recent = wellnessHistory.slice(-7)
                const avg =
                  recent.reduce((sum, d) => sum + (d[metric as keyof WellnessData] as number), 0) / recent.length
                const trend = getRecentTrend(metric as keyof WellnessData)

                return (
                  <div key={metric} className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold">{avg.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {metric.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </div>
                    <div className="text-xs mt-1">
                      {getTrendIcon(trend)} {trend > 0 ? "Improving" : trend < 0 ? "Declining" : "Stable"}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
