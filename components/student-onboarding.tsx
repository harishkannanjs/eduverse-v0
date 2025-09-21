"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Target, TrendingUp, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"

interface StudentProfile {
  subjects: string[]
  percentageScores: { [subject: string]: number }
  difficulties: string[]
  learningStyle: string
  studyGoals: string
  availableHours: number
  preferredStudyTime: string
}

interface OnboardingProps {
  onComplete: (profile: StudentProfile) => void
  onSkip: () => void
}

const AVAILABLE_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Computer Science",
  "Economics",
  "Psychology",
  "Art",
  "Music",
]

const LEARNING_STYLES = [
  { value: "visual", label: "Visual (diagrams, charts, images)" },
  { value: "auditory", label: "Auditory (lectures, discussions)" },
  { value: "kinesthetic", label: "Kinesthetic (hands-on activities)" },
  { value: "reading", label: "Reading/Writing (notes, texts)" },
]

const STUDY_TIMES = [
  { value: "morning", label: "Morning (6AM - 12PM)" },
  { value: "afternoon", label: "Afternoon (12PM - 6PM)" },
  { value: "evening", label: "Evening (6PM - 10PM)" },
  { value: "night", label: "Night (10PM - 2AM)" },
]

export function StudentOnboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [profile, setProfile] = useState<StudentProfile>({
    subjects: [],
    percentageScores: {},
    difficulties: [],
    learningStyle: "",
    studyGoals: "",
    availableHours: 2,
    preferredStudyTime: "",
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleSubjectToggle = (subject: string) => {
    setProfile((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }))
  }

  const handleScoreChange = (subject: string, score: number) => {
    setProfile((prev) => ({
      ...prev,
      percentageScores: {
        ...prev.percentageScores,
        [subject]: score,
      },
    }))
  }

  const handleDifficultyToggle = (difficulty: string) => {
    setProfile((prev) => ({
      ...prev,
      difficulties: prev.difficulties.includes(difficulty)
        ? prev.difficulties.filter((d) => d !== difficulty)
        : [...prev.difficulties, difficulty],
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return profile.subjects.length > 0
      case 2:
        return profile.subjects.every((subject) => profile.percentageScores[subject] !== undefined)
      case 3:
        return profile.difficulties.length > 0
      case 4:
        return profile.learningStyle && profile.studyGoals && profile.preferredStudyTime
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Select Your Subjects</h2>
              <p className="text-muted-foreground">Choose the subjects you're currently studying</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_SUBJECTS.map((subject) => (
                <div
                  key={subject}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    profile.subjects.includes(subject)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleSubjectToggle(subject)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{subject}</span>
                    {profile.subjects.includes(subject) && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                </div>
              ))}
            </div>
            {profile.subjects.length > 0 && (
              <div className="text-center">
                <Badge variant="secondary" className="text-sm">
                  {profile.subjects.length} subject{profile.subjects.length !== 1 ? "s" : ""} selected
                </Badge>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Current Performance</h2>
              <p className="text-muted-foreground">Enter your recent percentage scores for each subject</p>
            </div>
            <div className="space-y-4">
              {profile.subjects.map((subject) => (
                <div key={subject} className="space-y-2">
                  <Label htmlFor={`score-${subject}`} className="flex items-center justify-between">
                    <span>{subject}</span>
                    <span className="text-sm text-muted-foreground">{profile.percentageScores[subject] || 0}%</span>
                  </Label>
                  <Input
                    id={`score-${subject}`}
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter percentage (0-100)"
                    value={profile.percentageScores[subject] || ""}
                    onChange={(e) => handleScoreChange(subject, Number.parseInt(e.target.value) || 0)}
                  />
                </div>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Areas of Difficulty</h2>
              <p className="text-muted-foreground">What challenges do you face in your studies?</p>
            </div>
            <div className="space-y-3">
              {[
                "Understanding complex concepts",
                "Memorizing information",
                "Time management",
                "Test anxiety",
                "Staying motivated",
                "Taking effective notes",
                "Problem-solving skills",
                "Reading comprehension",
                "Mathematical calculations",
                "Writing essays",
              ].map((difficulty) => (
                <div
                  key={difficulty}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    profile.difficulties.includes(difficulty)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleDifficultyToggle(difficulty)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{difficulty}</span>
                    {profile.difficulties.includes(difficulty) && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                </div>
              ))}
            </div>
            {profile.difficulties.length > 0 && (
              <div className="text-center">
                <Badge variant="secondary" className="text-sm">
                  {profile.difficulties.length} challenge{profile.difficulties.length !== 1 ? "s" : ""} selected
                </Badge>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Learning Preferences</h2>
              <p className="text-muted-foreground">Help us personalize your learning experience</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="learning-style">Preferred Learning Style</Label>
                <Select
                  value={profile.learningStyle}
                  onValueChange={(value) => setProfile((prev) => ({ ...prev, learningStyle: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your learning style" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEARNING_STYLES.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="study-goals">Study Goals</Label>
                <Textarea
                  id="study-goals"
                  placeholder="What do you want to achieve? (e.g., improve grades, prepare for exams, understand concepts better)"
                  value={profile.studyGoals}
                  onChange={(e) => setProfile((prev) => ({ ...prev, studyGoals: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="study-hours">Available Study Hours per Day</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="study-hours"
                    type="number"
                    min="1"
                    max="12"
                    value={profile.availableHours}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, availableHours: Number.parseInt(e.target.value) || 2 }))
                    }
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">hours</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="study-time">Preferred Study Time</Label>
                <Select
                  value={profile.preferredStudyTime}
                  onValueChange={(value) => setProfile((prev) => ({ ...prev, preferredStudyTime: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="When do you study best?" />
                  </SelectTrigger>
                  <SelectContent>
                    {STUDY_TIMES.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">Welcome to EduVerse!</CardTitle>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip Setup
            </Button>
          </div>
          <CardDescription>Let's personalize your learning experience in just a few steps</CardDescription>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}

          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={() => setCurrentStep((prev) => prev + 1)} disabled={!canProceed()}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => onComplete(profile)}
                disabled={!canProceed()}
                className="bg-primary hover:bg-primary/90"
              >
                Complete Setup
                <CheckCircle2 className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
