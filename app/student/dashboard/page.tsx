"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StudentOnboarding } from "@/components/student-onboarding"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Heart, Trophy, Clock, Target, TrendingUp, Play, Sparkles } from "lucide-react"

interface StudentProfile {
  subjects: string[]
  percentageScores: { [subject: string]: number }
  difficulties: string[]
  learningStyle: string
  studyGoals: string
  availableHours: number
  preferredStudyTime: string
}

interface StudyPlan {
  id: string
  subject: string
  title: string
  description: string
  estimatedTime: number
  priority: "high" | "medium" | "low"
  type: "concept" | "practice" | "review"
}

export default function StudentDashboard() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [studyPlan, setStudyPlan] = useState<StudyPlan[]>([])
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user has completed onboarding
    const savedProfile = localStorage.getItem("studentProfile")
    if (savedProfile) {
      setStudentProfile(JSON.parse(savedProfile))
    } else {
      // Show onboarding for new users
      setShowOnboarding(true)
    }
  }, [])

  useEffect(() => {
    if (studentProfile && studyPlan.length === 0) {
      generatePersonalizedStudyPlan(studentProfile)
    }
  }, [studentProfile])

  const handleOnboardingComplete = async (profile: StudentProfile) => {
    setIsGeneratingPlan(true)
    setStudentProfile(profile)
    localStorage.setItem("studentProfile", JSON.stringify(profile))
    setShowOnboarding(false)

    // Generate AI-powered study plan
    await generatePersonalizedStudyPlan(profile)
    setIsGeneratingPlan(false)
  }

  const generatePersonalizedStudyPlan = async (profile: StudentProfile) => {
    try {
      const response = await fetch("/api/generate-study-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        const data = await response.json()
        setStudyPlan(data.studyPlan || [])
      } else {
        // Fallback to client-side generation
        const generatedPlan = generateFallbackStudyPlan(profile)
        setStudyPlan(generatedPlan)
      }
    } catch (error) {
      console.error("Error generating study plan:", error)
      // Fallback to client-side generation
      const generatedPlan = generateFallbackStudyPlan(profile)
      setStudyPlan(generatedPlan)
    }
  }

  const generateFallbackStudyPlan = (profile: StudentProfile): StudyPlan[] => {
    const plan: StudyPlan[] = []

    profile.subjects.forEach((subject) => {
      const score = profile.percentageScores[subject] || 0

      // Generate recommendations based on score and difficulties
      if (score < 60) {
        plan.push({
          id: `${subject}-foundation`,
          subject,
          title: `${subject} Foundation Review`,
          description: `Review fundamental concepts in ${subject} to strengthen your base knowledge.`,
          estimatedTime: 45,
          priority: "high",
          type: "concept",
        })
      }

      if (score >= 60 && score < 80) {
        plan.push({
          id: `${subject}-practice`,
          subject,
          title: `${subject} Practice Problems`,
          description: `Work through practice problems to improve your ${subject} skills.`,
          estimatedTime: 30,
          priority: "medium",
          type: "practice",
        })
      }

      if (score >= 80) {
        plan.push({
          id: `${subject}-advanced`,
          subject,
          title: `Advanced ${subject} Topics`,
          description: `Explore advanced concepts and challenging problems in ${subject}.`,
          estimatedTime: 40,
          priority: "medium",
          type: "concept",
        })
      }
    })

    // Add difficulty-specific recommendations
    if (profile.difficulties.includes("Time management")) {
      plan.push({
        id: "time-management",
        subject: "Study Skills",
        title: "Time Management Techniques",
        description: "Learn effective time management strategies for better study habits.",
        estimatedTime: 20,
        priority: "high",
        type: "concept",
      })
    }

    if (profile.difficulties.includes("Test anxiety")) {
      plan.push({
        id: "test-anxiety",
        subject: "Wellness",
        title: "Test Anxiety Management",
        description: "Practice relaxation techniques and test-taking strategies.",
        estimatedTime: 25,
        priority: "medium",
        type: "practice",
      })
    }

    return plan.slice(0, 6) // Limit to 6 recommendations
  }

  if (showOnboarding) {
    return <StudentOnboarding onComplete={handleOnboardingComplete} onSkip={() => setShowOnboarding(false)} />
  }

  if (isGeneratingPlan) {
    return (
      <DashboardLayout title="Student Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Generating Your Personalized Study Plan</h3>
            <p className="text-muted-foreground">
              Our AI is analyzing your profile to create the perfect learning path...
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Welcome back, Alex!</h2>
              <p className="text-muted-foreground">
                {studentProfile
                  ? `Your personalized study plan is ready! You have ${studyPlan.length} recommendations.`
                  : "Ready to continue your learning journey? You have 3 new lessons and 2 quizzes waiting."}
              </p>
            </div>
            {!studentProfile && (
              <Button onClick={() => setShowOnboarding(true)} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Personalize Learning
              </Button>
            )}
          </div>
        </div>

        {/* AI-Generated Study Plan */}
        {studentProfile && studyPlan.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Your Personalized Study Plan
              </CardTitle>
              <CardDescription>
                Based on your profile: {studentProfile.subjects.join(", ")} • {studentProfile.learningStyle} learner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {studyPlan.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{item.title}</h4>
                          <Badge
                            variant={
                              item.priority === "high"
                                ? "destructive"
                                : item.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {item.priority}
                          </Badge>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.estimatedTime} min
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {item.subject}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="ml-4">
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Lessons Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Trophy className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Quizzes Passed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-1 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {studentProfile
                      ? Math.round(
                          Object.values(studentProfile.percentageScores).reduce((a, b) => a + b, 0) /
                            Object.values(studentProfile.percentageScores).length,
                        ) + "%"
                      : "85%"}
                  </p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-5 rounded-lg">
                  <Clock className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{studentProfile ? `${studentProfile.availableHours}h` : "24h"}</p>
                  <p className="text-sm text-muted-foreground">{studentProfile ? "Daily Goal" : "Study Time"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Lessons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Current Lessons
              </CardTitle>
              <CardDescription>Continue where you left off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">Introduction to Algebra</h4>
                    <p className="text-sm text-muted-foreground">Mathematics • Chapter 3</p>
                    <Progress value={75} className="mt-2 h-2" />
                  </div>
                  <Button size="sm" className="ml-4">
                    <Play className="h-4 w-4 mr-1" />
                    Continue
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">World War II History</h4>
                    <p className="text-sm text-muted-foreground">History • Chapter 8</p>
                    <Progress value={45} className="mt-2 h-2" />
                  </div>
                  <Button size="sm" className="ml-4">
                    <Play className="h-4 w-4 mr-1" />
                    Continue
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">Chemical Reactions</h4>
                    <p className="text-sm text-muted-foreground">Chemistry • Chapter 5</p>
                    <Progress value={20} className="mt-2 h-2" />
                  </div>
                  <Button size="sm" className="ml-4">
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Quizzes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Upcoming Quizzes
              </CardTitle>
              <CardDescription>Test your knowledge</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Algebra Quiz #3</h4>
                    <p className="text-sm text-muted-foreground">Due: Tomorrow</p>
                    <Badge variant="secondary" className="mt-1">
                      15 questions
                    </Badge>
                  </div>
                  <Button size="sm" onClick={() => router.push("/quiz")}>
                    Start Quiz
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">History Mid-term</h4>
                    <p className="text-sm text-muted-foreground">Due: Friday</p>
                    <Badge variant="secondary" className="mt-1">
                      25 questions
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => router.push("/quiz")}>
                    Review
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Chemistry Lab Quiz</h4>
                    <p className="text-sm text-muted-foreground">Due: Next Week</p>
                    <Badge variant="outline" className="mt-1">
                      10 questions
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => router.push("/quiz")}>
                    Prepare
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Learning Suggestions
              </CardTitle>
              <CardDescription>Personalized recommendations for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-primary/10 rounded">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Focus on Quadratic Equations</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on your recent quiz results, spending more time on quadratic equations could improve your
                        algebra scores by 15%.
                      </p>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        View Resources
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-secondary/10 rounded">
                      <BookOpen className="h-4 w-4 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Try Interactive History Timeline</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Visual learners like you often benefit from timeline exercises. This could help with your
                        upcoming history exam.
                      </p>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        Explore
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-chart-1 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-primary/10 rounded">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">Join Study Group Challenge</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Students in study groups score 20% higher. Join the "Chemistry Champions" group starting this
                        week.
                      </p>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        Join Group
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wellness Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Wellness & Balance
              </CardTitle>
              <CardDescription>Take care of your mental health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Daily Mood Check</h4>
                      <p className="text-sm text-muted-foreground">How are you feeling today?</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Check In
                    </Button>
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">5-Minute Meditation</h4>
                      <p className="text-sm text-muted-foreground">Reduce stress before studying</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Start
                    </Button>
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Study Break Reminder</h4>
                      <p className="text-sm text-muted-foreground">Take breaks every 45 minutes</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Set Timer
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-chart-5 border border-secondary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-secondary" />
                    <span className="font-medium text-sm">Wellness Streak: 7 days</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Great job maintaining your wellness routine! Keep it up for better focus and learning.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
