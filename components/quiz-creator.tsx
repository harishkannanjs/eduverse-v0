"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Trash2, Share2, Copy, Check } from "lucide-react"

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
  timeLimit: number
  description: string
}

interface QuizCreatorProps {
  onQuizCreated?: (quiz: Quiz) => void
  teacherId: string
  teacherName: string
}

export function QuizCreator({ onQuizCreated, teacherId, teacherName }: QuizCreatorProps) {
  const [quiz, setQuiz] = useState<Partial<Quiz>>({
    title: "",
    subject: "",
    difficulty: "medium",
    questions: [],
    timeLimit: 30,
    description: "",
  })
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
    difficulty: "medium",
    subject: "",
    topic: "",
  })
  const [shareCode, setShareCode] = useState("")
  const [isSharing, setIsSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  const addQuestion = () => {
    if (!currentQuestion.question?.trim()) return

    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: currentQuestion.type || "multiple-choice",
      question: currentQuestion.question,
      options:
        currentQuestion.type === "multiple-choice" ? currentQuestion.options?.filter((o) => o.trim()) : undefined,
      correctAnswer: currentQuestion.correctAnswer || "",
      explanation: currentQuestion.explanation || "",
      difficulty: currentQuestion.difficulty || "medium",
      subject: quiz.subject || "",
      topic: currentQuestion.topic || "",
    }

    setQuiz((prev) => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion],
    }))

    // Reset current question
    setCurrentQuestion({
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
      difficulty: "medium",
      subject: "",
      topic: "",
    })
  }

  const removeQuestion = (questionId: string) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions?.filter((q) => q.id !== questionId) || [],
    }))
  }

  const createAndShareQuiz = async () => {
    if (!quiz.title?.trim() || !quiz.questions?.length) return

    const completeQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: quiz.title,
      subject: quiz.subject || "",
      difficulty: quiz.difficulty || "medium",
      questions: quiz.questions,
      timeLimit: quiz.timeLimit || 30,
      description: quiz.description || "",
    }

    setIsSharing(true)
    try {
      const response = await fetch("/api/quiz-sharing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create",
          quiz: completeQuiz,
          teacherId,
          teacherName,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setShareCode(data.shareCode)
        onQuizCreated?.(completeQuiz)
      }
    } catch (error) {
      console.error("Error sharing quiz:", error)
    } finally {
      setIsSharing(false)
    }
  }

  const copyShareCode = async () => {
    if (!shareCode) return

    try {
      await navigator.clipboard.writeText(shareCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  if (shareCode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Quiz Shared Successfully!
          </CardTitle>
          <CardDescription>Your quiz "{quiz.title}" is now available to students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Share Code</h4>
                <p className="text-2xl font-mono font-bold text-primary">{shareCode}</p>
                <p className="text-sm text-muted-foreground">Students can use this code to access the quiz</p>
              </div>
              <Button onClick={copyShareCode} variant="outline">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Questions:</span>
              <p className="font-medium">{quiz.questions?.length}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Time Limit:</span>
              <p className="font-medium">{quiz.timeLimit} minutes</p>
            </div>
            <div>
              <span className="text-muted-foreground">Subject:</span>
              <p className="font-medium">{quiz.subject}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Difficulty:</span>
              <p className="font-medium capitalize">{quiz.difficulty}</p>
            </div>
          </div>

          <Button
            onClick={() => {
              setShareCode("")
              setQuiz({
                title: "",
                subject: "",
                difficulty: "medium",
                questions: [],
                timeLimit: 30,
                description: "",
              })
            }}
            className="w-full"
          >
            Create Another Quiz
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quiz Details */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
          <CardDescription>Set up the basic information for your quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quiz Title</Label>
              <Input
                placeholder="e.g., Algebra Chapter 5 Quiz"
                value={quiz.title || ""}
                onChange={(e) => setQuiz((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select
                value={quiz.subject || ""}
                onValueChange={(value) => setQuiz((prev) => ({ ...prev, subject: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Geography">Geography</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={quiz.difficulty || "medium"}
                onValueChange={(value: any) => setQuiz((prev) => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Limit (minutes)</Label>
              <Input
                type="number"
                min="5"
                max="180"
                value={quiz.timeLimit || 30}
                onChange={(e) => setQuiz((prev) => ({ ...prev, timeLimit: Number.parseInt(e.target.value) || 30 }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Brief description of what this quiz covers..."
              value={quiz.description || ""}
              onChange={(e) => setQuiz((prev) => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Add Question</CardTitle>
          <CardDescription>Create questions for your quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Question Type</Label>
              <Select
                value={currentQuestion.type || "multiple-choice"}
                onValueChange={(value: any) => setCurrentQuestion((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                  <SelectItem value="essay">Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Topic</Label>
              <Input
                placeholder="e.g., Quadratic Equations"
                value={currentQuestion.topic || ""}
                onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, topic: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Question</Label>
            <Textarea
              placeholder="Enter your question here..."
              value={currentQuestion.question || ""}
              onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, question: e.target.value }))}
              rows={3}
            />
          </div>

          {currentQuestion.type === "multiple-choice" && (
            <div className="space-y-2">
              <Label>Answer Options</Label>
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(currentQuestion.options || [])]
                      newOptions[index] = e.target.value
                      setCurrentQuestion((prev) => ({ ...prev, options: newOptions }))
                    }}
                  />
                  <RadioGroup
                    value={currentQuestion.correctAnswer as string}
                    onValueChange={(value) => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: value }))}
                  >
                    <RadioGroupItem value={option} />
                  </RadioGroup>
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === "true-false" && (
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <RadioGroup
                value={currentQuestion.correctAnswer as string}
                onValueChange={(value) => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" />
                  <Label>True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" />
                  <Label>False</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {(currentQuestion.type === "short-answer" || currentQuestion.type === "essay") && (
            <div className="space-y-2">
              <Label>Sample Answer / Keywords</Label>
              <Textarea
                placeholder="Provide a sample answer or key points to look for..."
                value={(currentQuestion.correctAnswer as string) || ""}
                onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                rows={2}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Explanation</Label>
            <Textarea
              placeholder="Explain why this is the correct answer..."
              value={currentQuestion.explanation || ""}
              onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, explanation: e.target.value }))}
              rows={2}
            />
          </div>

          <Button onClick={addQuestion} disabled={!currentQuestion.question?.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </CardContent>
      </Card>

      {/* Questions List */}
      {quiz.questions && quiz.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions ({quiz.questions.length})</CardTitle>
            <CardDescription>Review and manage your quiz questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Q{index + 1}</Badge>
                      <Badge variant="secondary">{question.type}</Badge>
                      <Badge variant="outline">{question.topic}</Badge>
                    </div>
                    <h4 className="font-medium mb-2">{question.question}</h4>
                    {question.options && (
                      <div className="text-sm text-muted-foreground">Options: {question.options.join(", ")}</div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Correct:{" "}
                      {Array.isArray(question.correctAnswer)
                        ? question.correctAnswer.join(", ")
                        : question.correctAnswer}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Create Quiz */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={createAndShareQuiz}
            disabled={!quiz.title?.trim() || !quiz.questions?.length || isSharing}
            className="w-full"
            size="lg"
          >
            {isSharing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Quiz...
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Create & Share Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
