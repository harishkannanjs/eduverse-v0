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

export interface WellnessData {
  stressLevel: number // 1-10 scale
  confidenceLevel: number // 1-10 scale
  focusLevel: number // 1-10 scale
  sleepHours: number
  exerciseMinutes: number
  socialInteraction: number // 1-10 scale
  moodRating: number // 1-10 scale
  studyEnvironment: "quiet" | "moderate" | "noisy"
  motivationLevel: number // 1-10 scale
  timestamp: Date
}

export interface StudentProfile {
  id: string
  name: string
  subjects: string[]
  learningStyle: "visual" | "auditory" | "kinesthetic" | "mixed"
  wellnessHistory: WellnessData[]
  academicGoals: string[]
  challenges: string[]
  preferences: {
    studyTime: "morning" | "afternoon" | "evening"
    breakFrequency: number // minutes
    studyDuration: number // minutes
  }
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
  static generateWellnessRecommendations(
    stressLevel: number,
    confidenceLevel: number,
    focusLevel: number,
    additionalData?: Partial<WellnessData>,
  ): AIInsight[] {
    const recommendations: AIInsight[] = []

    // RECOMMENDATIONS
    if (stressLevel > 7) {
      recommendations.push({
        id: `wellness-stress-${Date.now()}`,
        type: "recommendation",
        title: "Immediate Stress Relief",
        description: `High stress detected (${stressLevel}/10). Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8. Repeat 4 times.`,
        priority: "high",
        actionable: true,
        metadata: {
          category: "immediate-wellness",
          technique: "breathing",
          stressLevel,
          duration: "2-3 minutes",
        },
      })
    }

    if (focusLevel < 5) {
      recommendations.push({
        id: `wellness-focus-${Date.now()}`,
        type: "recommendation",
        title: "Focus Enhancement Strategy",
        description: `Low focus detected (${focusLevel}/10). Try the Pomodoro Technique: 25 minutes focused study, 5-minute break. Remove distractions from your environment.`,
        priority: "medium",
        actionable: true,
        metadata: {
          category: "study-technique",
          method: "pomodoro",
          focusLevel,
          tips: ["remove_distractions", "single_task", "timer_use"],
        },
      })
    }

    if (confidenceLevel < 4) {
      recommendations.push({
        id: `wellness-confidence-${Date.now()}`,
        type: "recommendation",
        title: "Confidence Building Exercise",
        description: `Low confidence (${confidenceLevel}/10). Write down 3 things you learned well recently. Start your next study session with an easy topic to build momentum.`,
        priority: "medium",
        actionable: true,
        metadata: {
          category: "confidence-building",
          confidenceLevel,
          exercises: ["success_journal", "easy_start", "positive_affirmations"],
        },
      })
    }

    // ALERTS for concerning patterns
    if (stressLevel > 8 && focusLevel < 4) {
      recommendations.push({
        id: `wellness-critical-${Date.now()}`,
        type: "alert",
        title: "Critical Wellness State",
        description:
          "Very high stress combined with very low focus. Consider taking a longer break, speaking with a counselor, or postponing intensive study until you feel better.",
        priority: "high",
        actionable: true,
        metadata: {
          category: "critical-wellness",
          stressLevel,
          focusLevel,
          actions: ["take_break", "seek_support", "postpone_study"],
        },
      })
    }

    // Additional wellness insights based on extra data
    if (additionalData?.sleepHours && additionalData.sleepHours < 6) {
      recommendations.push({
        id: `wellness-sleep-critical-${Date.now()}`,
        type: "alert",
        title: "Severe Sleep Deprivation",
        description: `Only ${additionalData.sleepHours} hours of sleep. This significantly impacts learning and memory. Prioritize sleep over extended study sessions.`,
        priority: "high",
        actionable: true,
        metadata: {
          category: "sleep-health",
          sleepHours: additionalData.sleepHours,
          impact: "severe_learning_impairment",
        },
      })
    }

    if (additionalData?.exerciseMinutes !== undefined && additionalData.exerciseMinutes < 30) {
      recommendations.push({
        id: `wellness-exercise-${Date.now()}`,
        type: "recommendation",
        title: "Physical Activity Boost",
        description:
          "Low physical activity can affect focus and mood. Try a 10-minute walk or light stretching between study sessions to improve cognitive function.",
        priority: "low",
        actionable: true,
        metadata: {
          category: "physical-wellness",
          currentExercise: additionalData.exerciseMinutes,
          suggestions: ["short_walks", "stretching", "desk_exercises"],
        },
      })
    }

    return recommendations
  }

  // Enhanced wellness-based insights generation
  static generateWellnessBasedInsights(
    studentProfile: StudentProfile,
    recentWellnessData: WellnessData[],
    academicPerformance: StudentPerformance,
  ): AIInsight[] {
    const insights: AIInsight[] = []

    if (recentWellnessData.length === 0) return insights

    const recentData = recentWellnessData.slice(-7) // Last 7 entries
    const avgStress = recentData.reduce((sum, d) => sum + d.stressLevel, 0) / recentData.length
    const avgConfidence = recentData.reduce((sum, d) => sum + d.confidenceLevel, 0) / recentData.length
    const avgFocus = recentData.reduce((sum, d) => sum + d.focusLevel, 0) / recentData.length
    const avgMood = recentData.reduce((sum, d) => sum + d.moodRating, 0) / recentData.length
    const avgSleep = recentData.reduce((sum, d) => sum + d.sleepHours, 0) / recentData.length

    // RECOMMENDATIONS Category
    if (avgStress > 7) {
      insights.push({
        id: `wellness-stress-rec-${Date.now()}`,
        type: "recommendation",
        title: "Stress Management Techniques",
        description: `Your stress levels have been elevated (${avgStress.toFixed(1)}/10). Try deep breathing exercises, short walks, or the 5-4-3-2-1 grounding technique before studying.`,
        priority: "high",
        actionable: true,
        metadata: {
          category: "wellness",
          techniques: ["deep_breathing", "progressive_relaxation", "mindfulness", "physical_exercise"],
          avgStress: avgStress.toFixed(1),
        },
      })
    }

    if (avgSleep < 7) {
      insights.push({
        id: `wellness-sleep-rec-${Date.now()}`,
        type: "recommendation",
        title: "Optimize Sleep Schedule",
        description: `You're averaging ${avgSleep.toFixed(1)} hours of sleep. Aim for 7-9 hours to improve focus and memory retention. Consider a consistent bedtime routine.`,
        priority: "medium",
        actionable: true,
        metadata: {
          category: "wellness",
          currentSleep: avgSleep.toFixed(1),
          tips: ["consistent_bedtime", "limit_screens", "cool_environment", "relaxation_routine"],
        },
      })
    }

    if (avgConfidence < 5) {
      insights.push({
        id: `wellness-confidence-rec-${Date.now()}`,
        type: "recommendation",
        title: "Build Academic Confidence",
        description: `Your confidence levels are below average (${avgConfidence.toFixed(1)}/10). Start with easier topics to build momentum, celebrate small wins, and consider study groups.`,
        priority: "medium",
        actionable: true,
        metadata: {
          category: "academic-wellness",
          currentConfidence: avgConfidence.toFixed(1),
          strategies: ["start_easy", "celebrate_wins", "peer_support", "positive_self_talk"],
        },
      })
    }

    // ALERTS Category
    const stressTrend = this.calculateTrend(recentData.map((d) => d.stressLevel))
    if (stressTrend > 0.5 && avgStress > 6) {
      insights.push({
        id: `wellness-stress-alert-${Date.now()}`,
        type: "alert",
        title: "Rising Stress Levels Detected",
        description: `Your stress levels have been increasing over the past week. Current average: ${avgStress.toFixed(1)}/10. Consider speaking with a counselor or taking a study break.`,
        priority: "high",
        actionable: true,
        metadata: {
          category: "wellness-alert",
          trend: "increasing",
          currentLevel: avgStress.toFixed(1),
          resources: ["counseling_services", "peer_support", "wellness_center"],
        },
      })
    }

    const focusTrend = this.calculateTrend(recentData.map((d) => d.focusLevel))
    if (focusTrend < -0.3 && avgFocus < 6) {
      insights.push({
        id: `wellness-focus-alert-${Date.now()}`,
        type: "alert",
        title: "Declining Focus Patterns",
        description: `Your focus levels have been decreasing (${avgFocus.toFixed(1)}/10). This may impact learning effectiveness. Consider adjusting your study environment or schedule.`,
        priority: "medium",
        actionable: true,
        metadata: {
          category: "academic-alert",
          trend: "decreasing",
          currentLevel: avgFocus.toFixed(1),
          suggestions: ["change_environment", "shorter_sessions", "eliminate_distractions"],
        },
      })
    }

    // TRENDS Category
    const moodTrend = this.calculateTrend(recentData.map((d) => d.moodRating))
    if (moodTrend > 0.3) {
      insights.push({
        id: `wellness-mood-trend-${Date.now()}`,
        type: "trend",
        title: "Positive Mood Improvement",
        description: `Your mood has been improving over the past week (${avgMood.toFixed(1)}/10). This positive trend often correlates with better academic performance.`,
        priority: "low",
        actionable: false,
        metadata: {
          category: "wellness-trend",
          trend: "improving",
          currentLevel: avgMood.toFixed(1),
          correlation: "positive_academic_impact",
        },
      })
    }

    // Correlation insights between wellness and academic performance
    const recentAcademicAvg = academicPerformance.scores.slice(-3).reduce((a, b) => a + b, 0) / 3
    if (avgStress < 5 && avgFocus > 7 && recentAcademicAvg > 85) {
      insights.push({
        id: `wellness-academic-correlation-${Date.now()}`,
        type: "trend",
        title: "Optimal Learning State Achieved",
        description: `Your wellness metrics show low stress (${avgStress.toFixed(1)}) and high focus (${avgFocus.toFixed(1)}), correlating with strong academic performance (${recentAcademicAvg.toFixed(1)}%).`,
        priority: "low",
        actionable: false,
        metadata: {
          category: "wellness-academic",
          stressLevel: avgStress.toFixed(1),
          focusLevel: avgFocus.toFixed(1),
          academicPerformance: recentAcademicAvg.toFixed(1),
        },
      })
    }

    // Personalized recommendations based on learning style and wellness
    if (studentProfile.learningStyle === "visual" && avgFocus < 6) {
      insights.push({
        id: `wellness-visual-rec-${Date.now()}`,
        type: "recommendation",
        title: "Visual Learning Focus Enhancement",
        description:
          "As a visual learner with current focus challenges, try using colorful mind maps, diagrams, and visual timers to maintain concentration.",
        priority: "medium",
        actionable: true,
        metadata: {
          category: "personalized-wellness",
          learningStyle: "visual",
          techniques: ["mind_maps", "color_coding", "visual_timers", "infographics"],
        },
      })
    }

    return insights
  }

  // Calculate trend from array of values (-1 to 1, where 1 is strong positive trend)
  private static calculateTrend(values: number[]): number {
    if (values.length < 2) return 0

    const n = values.length
    const sumX = (n * (n - 1)) / 2 // Sum of indices
    const sumY = values.reduce((a, b) => a + b, 0)
    const sumXY = values.reduce((sum, y, x) => sum + x * y, 0)
    const sumX2 = values.reduce((sum, _, x) => sum + x * x, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

    // Normalize slope to -1 to 1 range
    return Math.max(-1, Math.min(1, slope / 2))
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
