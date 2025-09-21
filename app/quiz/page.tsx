"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  Clock,
  Target,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Play,
  BookOpen,
  TrendingUp,
  Zap,
  Star,
} from "lucide-react"

interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer" | "essay"
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  subject: string
  topic: string
}

interface Quiz {
  id: string
  title: string
  subject: string
  difficulty: "easy" | "medium" | "hard"
  questions: Question[]
  timeLimit: number // in minutes
  createdAt: Date
  description: string
}

interface QuizResult {
  quizId: string
  score: number
  totalQuestions: number
  timeSpent: number
  answers: { [questionId: string]: string | string[] }
  completedAt: Date
}

interface StudentProfile {
  subjects: string[]
  percentageScores: { [subject: string]: number }
  difficulties: string[]
  learningStyle: string
}

export default function QuizPage() {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: string]: string | string[] }>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizState, setQuizState] = useState<"selection" | "active" | "completed" | "results">("selection")
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")

  useEffect(() => {
    loadStudentProfile()
    loadQuizHistory()
    loadAvailableQuizzes()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (quizState === "active" && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            submitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [quizState, timeRemaining])

  const loadStudentProfile = () => {
    const saved = localStorage.getItem("studentProfile")
    if (saved) {
      setStudentProfile(JSON.parse(saved))
    }
  }

  const loadQuizHistory = () => {
    const saved = localStorage.getItem("quizHistory")
    if (saved) {
      setQuizHistory(
        JSON.parse(saved).map((result: any) => ({
          ...result,
          completedAt: new Date(result.completedAt),
        })),
      )
    }
  }

  const loadAvailableQuizzes = () => {
    const saved = localStorage.getItem("availableQuizzes")
    if (saved) {
      setAvailableQuizzes(
        JSON.parse(saved).map((quiz: any) => ({
          ...quiz,
          createdAt: new Date(quiz.createdAt),
        })),
      )
    }
  }

  const generatePersonalizedQuiz = async () => {
    if (!studentProfile) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentProfile,
          quizHistory,
          preferences: {
            subject: selectedSubject !== "all" ? selectedSubject : null,
            difficulty: selectedDifficulty !== "all" ? selectedDifficulty : null,
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const newQuiz = {
          ...data.quiz,
          createdAt: new Date(),
        }
        const updatedQuizzes = [...availableQuizzes, newQuiz]
        setAvailableQuizzes(updatedQuizzes)
        localStorage.setItem("availableQuizzes", JSON.stringify(updatedQuizzes))
      }
    } catch (error) {
      console.error("Error generating quiz:", error)
      // Fallback to client-side generation
      const fallbackQuiz = generateFallbackQuiz()
      const updatedQuizzes = [...availableQuizzes, fallbackQuiz]
      setAvailableQuizzes(updatedQuizzes)
      localStorage.setItem("availableQuizzes", JSON.stringify(updatedQuizzes))
    } finally {
      setIsGenerating(false)
    }
  }

  const generateFallbackQuiz = (): Quiz => {
    const subjects = studentProfile?.subjects || ["Mathematics", "Science", "English"]
    const subject = selectedSubject !== "all" ? selectedSubject : subjects[Math.floor(Math.random() * subjects.length)]
    const difficulty = (selectedDifficulty !== "all" ? selectedDifficulty : "medium") as "easy" | "medium" | "hard"

    const sampleQuestions: Question[] = [
      {
        id: "q1",
        type: "multiple-choice",
        question: `What is the primary focus of ${subject}?`,
        options: ["Theory", "Practice", "Application", "All of the above"],
        correctAnswer: "All of the above",
        explanation: `${subject} encompasses theory, practice, and application.`,
        difficulty,
        subject,
        topic: "Fundamentals",
      },
      {
        id: "q2",
        type: "true-false",
        question: `${subject} requires critical thinking skills.`,
        correctAnswer: "true",
        explanation: "Critical thinking is essential in all academic subjects.",
        difficulty,
        subject,
        topic: "Skills",
      },
      {
        id: "q3",
        type: "short-answer",
        question: `Name one key concept in ${subject}.`,
        correctAnswer: "Various answers accepted",
        explanation: "There are many key concepts depending on the specific area of study.",
        difficulty,
        subject,
        topic: "Concepts",
      },
    ]

    return {
      id: `quiz-${Date.now()}`,
      title: `${subject} Assessment - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
      subject,
      difficulty,
      questions: sampleQuestions,
      timeLimit: 15,
      createdAt: new Date(),
      description: `A personalized ${difficulty} level quiz for ${subject} based on your learning profile.`,
    }
  }

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setTimeRemaining(quiz.timeLimit * 60) // Convert to seconds
    setQuizState("active")
  }

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const nextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const submitQuiz = () => {
    if (!currentQuiz) return

    const score = calculateScore()
    const result: QuizResult = {
      quizId: currentQuiz.id,
      score,
      totalQuestions: currentQuiz.questions.length,
      timeSpent: currentQuiz.timeLimit * 60 - timeRemaining,
      answers,
      completedAt: new Date(),
    }

    setQuizResult(result)
    const updatedHistory = [...quizHistory, result]
    setQuizHistory(updatedHistory)
    localStorage.setItem("quizHistory", JSON.stringify(updatedHistory))
    setQuizState("results")
  }

  const calculateScore = (): number => {
    if (!currentQuiz) return 0

    let correct = 0
    currentQuiz.questions.forEach((question) => {
      const userAnswer = answers[question.id]
      if (Array.isArray(question.correctAnswer)) {
        // Multiple correct answers
        if (
          Array.isArray(userAnswer) &&
          userAnswer.length === question.correctAnswer.length &&
          userAnswer.every((ans) => question.correctAnswer.includes(ans))
        ) {
          correct++
        }
      } else {
        // Single correct answer
        if (userAnswer === question.correctAnswer) {
          correct++
        }
      }
    })

    return Math.round((correct / currentQuiz.questions.length) * 100)
  }

  const resetQuiz = () => {
    setCurrentQuiz(null)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setTimeRemaining(0)
    setQuizState("selection")
    setQuizResult(null)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: "Excellent", variant: "default" as const }
    if (score >= 70) return { label: "Good", variant: "secondary" as const }
    if (score >= 50) return { label: "Fair", variant: "outline" as const }
    return { label: "Needs Improvement", variant: "destructive" as const }
  }

  const filteredQuizzes = availableQuizzes.filter((quiz) => {
    if (selectedSubject !== "all" && quiz.subject !== selectedSubject) return false
    if (selectedDifficulty !== "all" && quiz.difficulty !== selectedDifficulty) return false
    return true
  })

  const averageScore =
    quizHistory.length > 0
      ? Math.round(quizHistory.reduce((sum, result) => sum + result.score, 0) / quizHistory.length)
      : 0

  if (quizState === "active" && currentQuiz) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100

    return (
      <DashboardLayout title="Quiz">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Quiz Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {currentQuiz.title}
                  </CardTitle>
                  <CardDescription>
                    Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className={`font-mono ${timeRemaining < 300 ? "text-red-600" : ""}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  <Badge variant="outline">{currentQuestion.difficulty}</Badge>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
          </Card>

          {/* Question */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{currentQuestion.subject}</Badge>
                <Badge variant="outline">{currentQuestion.topic}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.type === "multiple-choice" && (
                <RadioGroup
                  value={(answers[currentQuestion.id] as string) || ""}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                >
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === "true-false" && (
                <RadioGroup
                  value={(answers[currentQuestion.id] as string) || ""}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true" className="cursor-pointer">
                      True
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false" className="cursor-pointer">
                      False
                    </Label>
                  </div>
                </RadioGroup>
              )}

              {currentQuestion.type === "short-answer" && (
                <Textarea
                  placeholder="Enter your answer..."
                  value={(answers[currentQuestion.id] as string) || ""}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  rows={3}
                />
              )}

              {currentQuestion.type === "essay" && (
                <Textarea
                  placeholder="Write your essay response..."
                  value={(answers[currentQuestion.id] as string) || ""}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  rows={6}
                />
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentQuiz.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentQuestionIndex
                      ? "bg-primary"
                      : answers[currentQuiz.questions[index].id]
                        ? "bg-green-500"
                        : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
              <Button onClick={submitQuiz} className="bg-green-600 hover:bg-green-700">
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={nextQuestion}>Next</Button>
            )}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (quizState === "results" && quizResult && currentQuiz) {
    const scoreBadge = getScoreBadge(quizResult.score)

    return (
      <DashboardLayout title="Quiz Results">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Results Summary */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                {quizResult.score >= 70 ? (
                  <Trophy className="h-16 w-16 text-yellow-500" />
                ) : (
                  <Target className="h-16 w-16 text-blue-500" />
                )}
              </div>
              <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
              <CardDescription>{currentQuiz.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(quizResult.score)}`}>{quizResult.score}%</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                  <Badge variant={scoreBadge.variant} className="mt-1">
                    {scoreBadge.label}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">{Object.keys(answers).length}</div>
                  <div className="text-sm text-muted-foreground">Questions Answered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">{formatTime(quizResult.timeSpent)}</div>
                  <div className="text-sm text-muted-foreground">Time Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    {Math.round(
                      (Object.keys(answers).filter(
                        (qId) => answers[qId] === currentQuiz.questions.find((q) => q.id === qId)?.correctAnswer,
                      ).length /
                        currentQuiz.questions.length) *
                        100,
                    )}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Review */}
          <Card>
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
              <CardDescription>Review your answers and explanations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuiz.questions.map((question, index) => {
                const userAnswer = answers[question.id]
                const isCorrect = Array.isArray(question.correctAnswer)
                  ? Array.isArray(userAnswer) &&
                    userAnswer.length === question.correctAnswer.length &&
                    userAnswer.every((ans) => question.correctAnswer.includes(ans))
                  : userAnswer === question.correctAnswer

                return (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">
                          Question {index + 1}: {question.question}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Your answer: </span>
                            <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                              {Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer || "Not answered"}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div>
                              <span className="font-medium">Correct answer: </span>
                              <span className="text-green-600">
                                {Array.isArray(question.correctAnswer)
                                  ? question.correctAnswer.join(", ")
                                  : question.correctAnswer}
                              </span>
                            </div>
                          )}
                          <div className="text-muted-foreground">
                            <span className="font-medium">Explanation: </span>
                            {question.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-4">
            <Button onClick={resetQuiz} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Take Another Quiz
            </Button>
            <Button onClick={() => (window.location.href = "/student/dashboard")}>Back to Dashboard</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Quiz Center">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Trophy className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{quizHistory.length}</p>
                  <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{averageScore}%</p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{quizHistory.filter((result) => result.score >= 90).length}</p>
                  <p className="text-sm text-muted-foreground">Perfect Scores</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{availableQuizzes.length}</p>
                  <p className="text-sm text-muted-foreground">Available Quizzes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Generate Personalized Quiz
            </CardTitle>
            <CardDescription>Create a custom quiz based on your learning profile and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {studentProfile?.subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    )) || [
                      <SelectItem key="math" value="Mathematics">
                        Mathematics
                      </SelectItem>,
                      <SelectItem key="science" value="Science">
                        Science
                      </SelectItem>,
                      <SelectItem key="english" value="English">
                        English
                      </SelectItem>,
                    ]}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={generatePersonalizedQuiz} disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Quizzes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Available Quizzes
            </CardTitle>
            <CardDescription>Choose from available quizzes or generate new ones</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredQuizzes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">No quizzes available</p>
                <p className="text-sm">Generate your first personalized quiz above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {quiz.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {quiz.subject}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {quiz.timeLimit} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {quiz.questions.length} questions
                        </div>
                      </div>
                      <Button onClick={() => startQuiz(quiz)} className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Start Quiz
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Results */}
        {quizHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quizHistory
                  .slice(-5)
                  .reverse()
                  .map((result, index) => {
                    const quiz = availableQuizzes.find((q) => q.id === result.quizId)
                    const scoreBadge = getScoreBadge(result.score)

                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{quiz?.title || "Quiz"}</h4>
                          <p className="text-sm text-muted-foreground">
                            {result.completedAt.toLocaleDateString()} • {formatTime(result.timeSpent)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={scoreBadge.variant}>{result.score}%</Badge>
                          <span className="text-sm text-muted-foreground">{result.totalQuestions} questions</span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
