import { type NextRequest, NextResponse } from "next/server"

interface QuizAttempt {
  id: string
  quizId: string
  studentId: string
  studentName: string
  score: number
  timeSpent: number
  answers: { [questionId: string]: string | string[] }
  completedAt: Date
  wellnessData?: {
    stressLevel: number
    confidenceLevel: number
    focusLevel: number
  }
}

// In-memory storage for demo (replace with database in production)
const quizAttempts: QuizAttempt[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === "submit") {
      // Student submits quiz attempt with wellness data
      const attempt: QuizAttempt = {
        id: `attempt-${Date.now()}`,
        quizId: data.quizId,
        studentId: data.studentId,
        studentName: data.studentName,
        score: data.score,
        timeSpent: data.timeSpent,
        answers: data.answers,
        completedAt: new Date(),
        wellnessData: data.wellnessData,
      }

      quizAttempts.push(attempt)

      return NextResponse.json({
        success: true,
        attemptId: attempt.id,
      })
    }

    if (action === "analytics") {
      // Get analytics for a specific quiz
      const attempts = quizAttempts.filter((a) => a.quizId === data.quizId)

      const analytics = {
        totalAttempts: attempts.length,
        averageScore:
          attempts.length > 0 ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length) : 0,
        averageTime:
          attempts.length > 0 ? Math.round(attempts.reduce((sum, a) => sum + a.timeSpent, 0) / attempts.length) : 0,
        scoreDistribution: {
          excellent: attempts.filter((a) => a.score >= 90).length,
          good: attempts.filter((a) => a.score >= 70 && a.score < 90).length,
          fair: attempts.filter((a) => a.score >= 50 && a.score < 70).length,
          needsImprovement: attempts.filter((a) => a.score < 50).length,
        },
        wellnessInsights:
          attempts.filter((a) => a.wellnessData).length > 0
            ? {
                averageStress: Math.round(
                  attempts
                    .filter((a) => a.wellnessData)
                    .reduce((sum, a) => sum + (a.wellnessData?.stressLevel || 0), 0) /
                    attempts.filter((a) => a.wellnessData).length,
                ),
                averageConfidence: Math.round(
                  attempts
                    .filter((a) => a.wellnessData)
                    .reduce((sum, a) => sum + (a.wellnessData?.confidenceLevel || 0), 0) /
                    attempts.filter((a) => a.wellnessData).length,
                ),
                averageFocus: Math.round(
                  attempts
                    .filter((a) => a.wellnessData)
                    .reduce((sum, a) => sum + (a.wellnessData?.focusLevel || 0), 0) /
                    attempts.filter((a) => a.wellnessData).length,
                ),
              }
            : null,
        recentAttempts: attempts.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime()).slice(0, 10),
      }

      return NextResponse.json({
        success: true,
        analytics,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Quiz analytics error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
