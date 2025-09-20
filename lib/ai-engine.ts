// AI Engine for EduVerse - Handles personalized learning, insights, and recommendations

export interface StudentPerformance {
  studentId: string
  subject: string
  scores: number[]
  completedLessons: number
  timeSpent: number
  strengths: string[]
  weaknesses: string[]
  learningStyle: "visual" | "auditory" | "kinesthetic" | "mixed"
}

export interface AIInsight {
  id: string
  type: "recommendation" | "alert" | "achievement" | "trend"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  actionable: boolean
  metadata?: Record<string, any>
}

export interface LessonPlan {
  id: string
  title: string
  subject: string
  duration: number
  objectives: string[]
  activities: string[]
  assessments: string[]
  resources: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  learningStyles: string[]
}

export class AIEngine {
  // Analyze student performance and generate personalized insights
  static analyzeStudentPerformance(performance: StudentPerformance): AIInsight[] {
    const insights: AIInsight[] = []

    // Performance trend analysis
    if (performance.scores.length >= 3) {
      const recentScores = performance.scores.slice(-3)
      const averageRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length
      const overallAverage = performance.scores.reduce((a, b) => a + b, 0) / performance.scores.length

      if (averageRecent > overallAverage + 5) {
        insights.push({
          id: `trend-${performance.studentId}-${Date.now()}`,
          type: "trend",
          title: "Improving Performance",
          description: `Strong upward trend in ${performance.subject}. Recent scores are ${Math.round(
            averageRecent - overallAverage,
          )}% higher than average.`,
          priority: "medium",
          actionable: false,
        })
      } else if (averageRecent < overallAverage - 5) {
        insights.push({
          id: `alert-${performance.studentId}-${Date.now()}`,
          type: "alert",
          title: "Performance Decline",
          description: `Recent scores in ${performance.subject} are below average. Consider additional support.`,
          priority: "high",
          actionable: true,
          metadata: { suggestedActions: ["extra_practice", "tutoring", "review_materials"] },
        })
      }
    }

    // Learning style recommendations
    if (performance.learningStyle === "visual") {
      insights.push({
        id: `rec-${performance.studentId}-visual`,
        type: "recommendation",
        title: "Visual Learning Resources",
        description: "Try interactive diagrams and mind maps for better understanding of complex concepts.",
        priority: "medium",
        actionable: true,
        metadata: { resources: ["interactive_diagrams", "mind_maps", "visual_simulations"] },
      })
    }

    // Achievement recognition
    if (performance.scores.some((score) => score >= 95)) {
      insights.push({
        id: `achievement-${performance.studentId}-excellence`,
        type: "achievement",
        title: "Excellence Achievement",
        description: `Outstanding performance in ${performance.subject}! Consider advanced coursework.`,
        priority: "low",
        actionable: true,
        metadata: { nextSteps: ["advanced_courses", "peer_tutoring", "enrichment_activities"] },
      })
    }

    return insights
  }

  // Generate personalized lesson plans using AI
  static generateLessonPlan(
    subject: string,
    topic: string,
    studentLevel: "beginner" | "intermediate" | "advanced",
    duration: number,
    learningStyles: string[],
  ): LessonPlan {
    const lessonPlan: LessonPlan = {
      id: `lesson-${Date.now()}`,
      title: `${topic} - ${subject}`,
      subject,
      duration,
      difficulty: studentLevel,
      learningStyles,
      objectives: [],
      activities: [],
      assessments: [],
      resources: [],
    }

    // Generate objectives based on subject and level
    switch (subject.toLowerCase()) {
      case "mathematics":
        lessonPlan.objectives = [
          `Understand the fundamental concepts of ${topic}`,
          `Apply ${topic} principles to solve real-world problems`,
          `Demonstrate proficiency through practice exercises`,
        ]
        lessonPlan.activities = [
          "Interactive problem-solving session",
          "Step-by-step guided practice",
          "Collaborative group work",
        ]
        break
      case "science":
        lessonPlan.objectives = [
          `Explain the scientific principles behind ${topic}`,
          `Conduct experiments to observe ${topic} in action`,
          `Analyze and interpret experimental results`,
        ]
        lessonPlan.activities = [
          "Hands-on laboratory experiment",
          "Data collection and analysis",
          "Scientific method application",
        ]
        break
      case "history":
        lessonPlan.objectives = [
          `Analyze the historical significance of ${topic}`,
          `Evaluate multiple perspectives on ${topic}`,
          `Connect historical events to modern contexts`,
        ]
        lessonPlan.activities = [
          "Primary source document analysis",
          "Timeline creation activity",
          "Historical debate simulation",
        ]
        break
      default:
        lessonPlan.objectives = [
          `Master key concepts related to ${topic}`,
          `Apply knowledge through practical exercises`,
          `Demonstrate understanding through assessment`,
        ]
        lessonPlan.activities = ["Interactive learning session", "Practice exercises", "Group discussion"]
    }

    // Customize activities based on learning styles
    if (learningStyles.includes("visual")) {
      lessonPlan.activities.push("Visual diagrams and charts", "Mind mapping exercise")
      lessonPlan.resources.push("Interactive visual aids", "Graphic organizers")
    }

    if (learningStyles.includes("kinesthetic")) {
      lessonPlan.activities.push("Hands-on manipulation", "Movement-based learning")
      lessonPlan.resources.push("Physical manipulatives", "Interactive simulations")
    }

    if (learningStyles.includes("auditory")) {
      lessonPlan.activities.push("Discussion and verbal explanation", "Audio recordings")
      lessonPlan.resources.push("Podcast materials", "Verbal instruction guides")
    }

    // Add assessments
    lessonPlan.assessments = [
      "Formative assessment during activities",
      "Exit ticket with key concepts",
      "Practice quiz for reinforcement",
    ]

    // Add general resources
    lessonPlan.resources.push(
      `${subject} textbook chapter on ${topic}`,
      "Online practice exercises",
      "Supplementary reading materials",
    )

    return lessonPlan
  }

  // Analyze class performance for teachers
  static analyzeClassPerformance(performances: StudentPerformance[]): {
    classAverage: number
    trends: string[]
    recommendations: string[]
    strugglingStudents: string[]
    topPerformers: string[]
  } {
    const allScores = performances.flatMap((p) => p.scores)
    const classAverage = allScores.reduce((a, b) => a + b, 0) / allScores.length

    const strugglingStudents = performances
      .filter((p) => {
        const avg = p.scores.reduce((a, b) => a + b, 0) / p.scores.length
        return avg < classAverage - 10
      })
      .map((p) => p.studentId)

    const topPerformers = performances
      .filter((p) => {
        const avg = p.scores.reduce((a, b) => a + b, 0) / p.scores.length
        return avg > classAverage + 10
      })
      .map((p) => p.studentId)

    const trends = []
    const recommendations = []

    // Analyze learning styles distribution
    const learningStyles = performances.reduce(
      (acc, p) => {
        acc[p.learningStyle] = (acc[p.learningStyle] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const dominantStyle = Object.entries(learningStyles).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

    trends.push(`${Math.round(classAverage)}% class average performance`)
    trends.push(`${dominantStyle} learners make up the majority of the class`)

    if (strugglingStudents.length > performances.length * 0.2) {
      recommendations.push("Consider additional support for struggling students")
      recommendations.push("Implement differentiated instruction strategies")
    }

    if (dominantStyle === "visual") {
      recommendations.push("Incorporate more visual aids and diagrams in lessons")
    } else if (dominantStyle === "kinesthetic") {
      recommendations.push("Add more hands-on activities and experiments")
    } else if (dominantStyle === "auditory") {
      recommendations.push("Include more discussion and verbal instruction")
    }

    return {
      classAverage,
      trends,
      recommendations,
      strugglingStudents,
      topPerformers,
    }
  }

  // Generate wellness recommendations
  static generateWellnessRecommendations(studyHours: number, stressLevel: number, sleepHours: number): AIInsight[] {
    const recommendations: AIInsight[] = []

    if (studyHours > 6) {
      recommendations.push({
        id: `wellness-study-${Date.now()}`,
        type: "recommendation",
        title: "Take Regular Breaks",
        description: "You've been studying for over 6 hours. Consider taking a 15-minute break every hour.",
        priority: "medium",
        actionable: true,
        metadata: { action: "break_reminder" },
      })
    }

    if (stressLevel > 7) {
      recommendations.push({
        id: `wellness-stress-${Date.now()}`,
        type: "alert",
        title: "High Stress Detected",
        description: "Your stress levels are elevated. Try some mindfulness exercises or talk to a counselor.",
        priority: "high",
        actionable: true,
        metadata: { resources: ["mindfulness_app", "counseling_services", "breathing_exercises"] },
      })
    }

    if (sleepHours < 7) {
      recommendations.push({
        id: `wellness-sleep-${Date.now()}`,
        type: "recommendation",
        title: "Improve Sleep Schedule",
        description: "Getting adequate sleep is crucial for learning. Aim for 7-9 hours per night.",
        priority: "medium",
        actionable: true,
        metadata: { tips: ["consistent_bedtime", "limit_screen_time", "relaxation_routine"] },
      })
    }

    return recommendations
  }

  // Predict student success and identify at-risk students
  static predictStudentSuccess(performance: StudentPerformance): {
    successProbability: number
    riskFactors: string[]
    interventions: string[]
  } {
    let successProbability = 0.5 // Base probability

    // Factor in recent performance
    const recentAverage = performance.scores.slice(-3).reduce((a, b) => a + b, 0) / 3
    successProbability += (recentAverage - 70) / 100 // Adjust based on recent scores

    // Factor in engagement (time spent)
    const expectedTime = performance.completedLessons * 30 // 30 minutes per lesson
    const engagementRatio = performance.timeSpent / expectedTime
    successProbability += (engagementRatio - 1) * 0.2

    // Factor in consistency
    const scoreVariance = this.calculateVariance(performance.scores)
    if (scoreVariance < 100) successProbability += 0.1 // Bonus for consistency

    // Clamp between 0 and 1
    successProbability = Math.max(0, Math.min(1, successProbability))

    const riskFactors = []
    const interventions = []

    if (recentAverage < 70) {
      riskFactors.push("Below average recent performance")
      interventions.push("Additional tutoring sessions")
    }

    if (engagementRatio < 0.8) {
      riskFactors.push("Low engagement with course materials")
      interventions.push("Motivational support and goal setting")
    }

    if (scoreVariance > 200) {
      riskFactors.push("Inconsistent performance")
      interventions.push("Study skills training")
    }

    if (performance.weaknesses.length > performance.strengths.length) {
      riskFactors.push("More weaknesses than strengths identified")
      interventions.push("Targeted skill development")
    }

    return {
      successProbability,
      riskFactors,
      interventions,
    }
  }

  private static calculateVariance(scores: number[]): number {
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length
    const squaredDiffs = scores.map((score) => Math.pow(score - mean, 2))
    return squaredDiffs.reduce((a, b) => a + b, 0) / scores.length
  }
}

// Mock data for demonstration
export const mockStudentPerformance: StudentPerformance = {
  studentId: "student-1",
  subject: "Mathematics",
  scores: [78, 82, 85, 88, 92, 89, 94],
  completedLessons: 12,
  timeSpent: 360, // minutes
  strengths: ["Problem solving", "Logical reasoning", "Pattern recognition"],
  weaknesses: ["Word problems", "Time management"],
  learningStyle: "visual",
}

export const mockClassPerformances: StudentPerformance[] = [
  mockStudentPerformance,
  {
    studentId: "student-2",
    subject: "Mathematics",
    scores: [65, 68, 72, 70, 74, 76, 78],
    completedLessons: 10,
    timeSpent: 280,
    strengths: ["Basic calculations", "Following procedures"],
    weaknesses: ["Complex problem solving", "Abstract concepts"],
    learningStyle: "kinesthetic",
  },
  {
    studentId: "student-3",
    subject: "Mathematics",
    scores: [92, 94, 89, 96, 93, 95, 97],
    completedLessons: 15,
    timeSpent: 420,
    strengths: ["Advanced concepts", "Independent learning", "Critical thinking"],
    weaknesses: ["Explaining solutions to others"],
    learningStyle: "mixed",
  },
]
