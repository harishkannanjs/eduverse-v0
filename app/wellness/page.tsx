"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Zap,
  Brain,
  Wind,
  Sun,
  Moon,
  Sparkles,
  TrendingUp,
  Calendar,
  Target,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"

interface MoodEntry {
  date: string
  mood: "great" | "good" | "okay" | "bad" | "terrible"
  energy: number
  stress: number
  journal: string
  activities: string[]
}

interface BreathingExercise {
  id: string
  name: string
  description: string
  duration: number
  pattern: { inhale: number; hold: number; exhale: number; pause: number }
  icon: React.ReactNode
}

const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: "box-breathing",
    name: "Box Breathing",
    description: "Equal counts for inhale, hold, exhale, and pause",
    duration: 240, // 4 minutes
    pattern: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
    icon: <Wind className="h-6 w-6" />,
  },
  {
    id: "calm-breathing",
    name: "Calm Breathing",
    description: "Longer exhale for relaxation",
    duration: 300, // 5 minutes
    pattern: { inhale: 4, hold: 2, exhale: 6, pause: 2 },
    icon: <Heart className="h-6 w-6" />,
  },
  {
    id: "energizing-breathing",
    name: "Energizing Breath",
    description: "Quick breathing to boost energy",
    duration: 180, // 3 minutes
    pattern: { inhale: 3, hold: 1, exhale: 3, pause: 1 },
    icon: <Zap className="h-6 w-6" />,
  },
]

const MOOD_OPTIONS = [
  { value: "great", label: "Great", color: "bg-green-500", emoji: "😄" },
  { value: "good", label: "Good", color: "bg-blue-500", emoji: "😊" },
  { value: "okay", label: "Okay", color: "bg-yellow-500", emoji: "😐" },
  { value: "bad", label: "Not Good", color: "bg-orange-500", emoji: "😔" },
  { value: "terrible", label: "Terrible", color: "bg-red-500", emoji: "😢" },
]

const ACTIVITIES = [
  "Exercise",
  "Reading",
  "Music",
  "Friends",
  "Nature",
  "Gaming",
  "Art",
  "Cooking",
  "Sleep",
  "Study",
  "Family",
  "Meditation",
]

export default function WellnessPage() {
  const [currentMood, setCurrentMood] = useState<MoodEntry>({
    date: new Date().toISOString().split("T")[0],
    mood: "okay",
    energy: 5,
    stress: 5,
    journal: "",
    activities: [],
  })

  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [showBreathingDialog, setShowBreathingDialog] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null)
  const [breathingState, setBreathingState] = useState<"ready" | "active" | "paused" | "completed">("ready")
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale" | "pause">("inhale")
  const [breathingCount, setBreathingCount] = useState(0)
  const [breathingProgress, setBreathingProgress] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false)
  const [aiInsights, setAiInsights] = useState<string[]>([])

  useEffect(() => {
    loadMoodHistory()
    checkTodayCheckIn()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (breathingState === "active" && selectedExercise) {
      interval = setInterval(() => {
        setBreathingCount((prev) => {
          const pattern = selectedExercise.pattern
          const currentPhaseTime = pattern[breathingPhase]

          if (prev >= currentPhaseTime) {
            // Move to next phase
            const phases: Array<keyof typeof pattern> = ["inhale", "hold", "exhale", "pause"]
            const currentIndex = phases.indexOf(breathingPhase)
            const nextIndex = (currentIndex + 1) % phases.length
            setBreathingPhase(phases[nextIndex])
            return 1
          }
          return prev + 1
        })

        setTotalTime((prev) => {
          const newTime = prev + 1
          if (newTime >= selectedExercise.duration) {
            setBreathingState("completed")
            return selectedExercise.duration
          }
          return newTime
        })

        setBreathingProgress((prev) => {
          const newProgress = (totalTime / selectedExercise.duration) * 100
          return Math.min(newProgress, 100)
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [breathingState, breathingPhase, selectedExercise, totalTime])

  const loadMoodHistory = () => {
    const saved = localStorage.getItem("moodHistory")
    if (saved) {
      setMoodHistory(JSON.parse(saved))
    }
  }

  const checkTodayCheckIn = () => {
    const today = new Date().toISOString().split("T")[0]
    const saved = localStorage.getItem("moodHistory")
    if (saved) {
      const history = JSON.parse(saved)
      const todayEntry = history.find((entry: MoodEntry) => entry.date === today)
      setHasCheckedInToday(!!todayEntry)
      if (todayEntry) {
        setCurrentMood(todayEntry)
      }
    }
  }

  const saveMoodEntry = async () => {
    const newHistory = [...moodHistory.filter((entry) => entry.date !== currentMood.date), currentMood]
    setMoodHistory(newHistory)
    localStorage.setItem("moodHistory", JSON.stringify(newHistory))
    setHasCheckedInToday(true)

    // Generate AI insights based on mood data
    await generateAIInsights(newHistory)
  }

  const generateAIInsights = async (history: MoodEntry[]) => {
    try {
      const response = await fetch("/api/wellness-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ moodHistory: history }),
      })

      if (response.ok) {
        const data = await response.json()
        setAiInsights(data.insights || [])
      }
    } catch (error) {
      console.error("Error generating AI insights:", error)
      // Fallback insights
      setAiInsights([
        "Your mood has been stable this week. Keep up the good work!",
        "Consider adding more physical activity to boost your energy levels.",
        "Your stress levels seem manageable. Great job on self-care!",
      ])
    }
  }

  const startBreathingExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise)
    setBreathingState("ready")
    setBreathingPhase("inhale")
    setBreathingCount(0)
    setBreathingProgress(0)
    setTotalTime(0)
    setShowBreathingDialog(true)
  }

  const toggleBreathing = () => {
    if (breathingState === "ready" || breathingState === "paused") {
      setBreathingState("active")
    } else if (breathingState === "active") {
      setBreathingState("paused")
    }
  }

  const resetBreathing = () => {
    setBreathingState("ready")
    setBreathingPhase("inhale")
    setBreathingCount(0)
    setBreathingProgress(0)
    setTotalTime(0)
  }

  const getBreathingInstruction = () => {
    if (!selectedExercise) return ""

    const instructions = {
      inhale: "Breathe in slowly...",
      hold: "Hold your breath...",
      exhale: "Breathe out gently...",
      pause: "Rest and prepare...",
    }

    return instructions[breathingPhase]
  }

  const getBreathingCircleSize = () => {
    if (breathingPhase === "inhale") return "scale-150"
    if (breathingPhase === "exhale") return "scale-75"
    return "scale-100"
  }

  const getMoodColor = (mood: string) => {
    const moodOption = MOOD_OPTIONS.find((option) => option.value === mood)
    return moodOption?.color || "bg-gray-500"
  }

  const getAverageScore = (key: "energy" | "stress") => {
    if (moodHistory.length === 0) return 5
    const sum = moodHistory.slice(-7).reduce((acc, entry) => acc + entry[key], 0)
    return Math.round(sum / Math.min(moodHistory.length, 7))
  }

  const getMoodStreak = () => {
    let streak = 0
    const sortedHistory = [...moodHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    for (const entry of sortedHistory) {
      if (entry.mood === "great" || entry.mood === "good") {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  return (
    <DashboardLayout title="Wellness Hub">
      <div className="space-y-6">
        {/* Wellness Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{getMoodStreak()}</p>
                  <p className="text-sm text-muted-foreground">Good Days Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{getAverageScore("energy")}/10</p>
                  <p className="text-sm text-muted-foreground">Avg Energy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Brain className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{10 - getAverageScore("stress")}/10</p>
                  <p className="text-sm text-muted-foreground">Stress Management</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{moodHistory.length}</p>
                  <p className="text-sm text-muted-foreground">Check-ins</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="checkin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="checkin">Daily Check-in</TabsTrigger>
            <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="checkin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Daily Wellness Check-in
                </CardTitle>
                <CardDescription>
                  {hasCheckedInToday
                    ? "You've already checked in today! You can update your entry below."
                    : "How are you feeling today? Your responses help our AI provide better support."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mood Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">How's your mood today?</Label>
                  <div className="flex flex-wrap gap-2">
                    {MOOD_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        variant={currentMood.mood === option.value ? "default" : "outline"}
                        onClick={() => setCurrentMood((prev) => ({ ...prev, mood: option.value as any }))}
                        className="flex items-center gap-2"
                      >
                        <span className="text-lg">{option.emoji}</span>
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Energy Level */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Energy Level: {currentMood.energy}/10</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Low</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentMood.energy}
                      onChange={(e) => setCurrentMood((prev) => ({ ...prev, energy: Number.parseInt(e.target.value) }))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-muted-foreground">High</span>
                  </div>
                </div>

                {/* Stress Level */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Stress Level: {currentMood.stress}/10</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Low</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentMood.stress}
                      onChange={(e) => setCurrentMood((prev) => ({ ...prev, stress: Number.parseInt(e.target.value) }))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-muted-foreground">High</span>
                  </div>
                </div>

                {/* Activities */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">What activities did you enjoy today?</Label>
                  <div className="flex flex-wrap gap-2">
                    {ACTIVITIES.map((activity) => (
                      <Button
                        key={activity}
                        variant={currentMood.activities.includes(activity) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setCurrentMood((prev) => ({
                            ...prev,
                            activities: prev.activities.includes(activity)
                              ? prev.activities.filter((a) => a !== activity)
                              : [...prev.activities, activity],
                          }))
                        }}
                      >
                        {activity}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Journal */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Journal (Optional)</Label>
                  <Textarea
                    placeholder="Write about your day, thoughts, or feelings..."
                    value={currentMood.journal}
                    onChange={(e) => setCurrentMood((prev) => ({ ...prev, journal: e.target.value }))}
                    rows={4}
                  />
                </div>

                <Button onClick={saveMoodEntry} className="w-full">
                  {hasCheckedInToday ? "Update Check-in" : "Save Check-in"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mindfulness" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Breathing Exercises */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wind className="h-5 w-5" />
                    Breathing Exercises
                  </CardTitle>
                  <CardDescription>Guided breathing exercises to help you relax and focus</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {BREATHING_EXERCISES.map((exercise) => (
                    <div key={exercise.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">{exercise.icon}</div>
                          <div>
                            <h4 className="font-medium">{exercise.name}</h4>
                            <p className="text-sm text-muted-foreground">{exercise.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {Math.floor(exercise.duration / 60)} minutes
                            </p>
                          </div>
                        </div>
                        <Button onClick={() => startBreathingExercise(exercise)}>
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Quick Wellness
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                    <Sun className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Morning Affirmations</div>
                      <div className="text-xs text-muted-foreground">Start your day positively</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                    <Moon className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Evening Reflection</div>
                      <div className="text-xs text-muted-foreground">Wind down peacefully</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                    <Target className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Focus Meditation</div>
                      <div className="text-xs text-muted-foreground">Improve concentration</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                    <Heart className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Gratitude Practice</div>
                      <div className="text-xs text-muted-foreground">Appreciate the good</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Wellness Insights
                </CardTitle>
                <CardDescription>Personalized recommendations based on your check-in data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.length > 0 ? (
                  aiInsights.map((insight, index) => (
                    <div key={index} className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-primary/10 rounded">
                          <Brain className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">{insight}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Complete a few daily check-ins to receive personalized AI insights!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Wellness Progress
                </CardTitle>
                <CardDescription>Track your wellness journey over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {moodHistory.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Recent Mood Trend</Label>
                        <div className="flex items-center gap-2">
                          {moodHistory.slice(-7).map((entry, index) => (
                            <div
                              key={index}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${getMoodColor(entry.mood)}`}
                              title={`${entry.date}: ${entry.mood}`}
                            >
                              {MOOD_OPTIONS.find((m) => m.value === entry.mood)?.emoji}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Weekly Averages</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Energy</span>
                            <Badge variant="secondary">{getAverageScore("energy")}/10</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Stress Management</span>
                            <Badge variant="secondary">{10 - getAverageScore("stress")}/10</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Recent Check-ins</Label>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {moodHistory
                          .slice(-10)
                          .reverse()
                          .map((entry, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">
                                    {MOOD_OPTIONS.find((m) => m.value === entry.mood)?.emoji}
                                  </span>
                                  <span className="font-medium capitalize">{entry.mood}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{entry.date}</span>
                              </div>
                              {entry.journal && (
                                <p className="text-sm text-muted-foreground line-clamp-2">{entry.journal}</p>
                              )}
                              {entry.activities.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {entry.activities.map((activity) => (
                                    <Badge key={activity} variant="outline" className="text-xs">
                                      {activity}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start tracking your wellness to see progress over time!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Breathing Exercise Dialog */}
        <Dialog open={showBreathingDialog} onOpenChange={setShowBreathingDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedExercise?.icon}
                {selectedExercise?.name}
              </DialogTitle>
              <DialogDescription>{selectedExercise?.description}</DialogDescription>
            </DialogHeader>

            {selectedExercise && (
              <div className="space-y-6 py-4">
                {/* Breathing Circle Animation */}
                <div className="flex items-center justify-center">
                  <div
                    className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-4 border-primary/30 flex items-center justify-center transition-transform duration-1000 ease-in-out ${getBreathingCircleSize()}`}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{breathingCount}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">{breathingPhase}</div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">{getBreathingInstruction()}</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, "0")} /{" "}
                    {Math.floor(selectedExercise.duration / 60)}:
                    {(selectedExercise.duration % 60).toString().padStart(2, "0")}
                  </p>
                </div>

                {/* Progress */}
                <Progress value={breathingProgress} className="h-2" />

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="sm" onClick={resetBreathing} disabled={breathingState === "ready"}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  <Button onClick={toggleBreathing} disabled={breathingState === "completed"} className="px-8">
                    {breathingState === "active" ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : breathingState === "completed" ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Completed!
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {breathingState === "ready" ? "Start" : "Resume"}
                      </>
                    )}
                  </Button>
                </div>

                {breathingState === "completed" && (
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <Sparkles className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Great job! You've completed the breathing exercise.
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                      Take a moment to notice how you feel.
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

function Label({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string; [key: string]: any }) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ""}`}
      {...props}
    >
      {children}
    </label>
  )
}
