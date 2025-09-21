import { type NextRequest, NextResponse } from "next/server"

interface SharedQuiz {
  id: string
  title: string
  subject: string
  difficulty: "easy" | "medium" | "hard"
  questions: any[]
  timeLimit: number
  createdBy: string
  teacherName: string
  shareCode: string
  createdAt: Date
  expiresAt?: Date
  isActive: boolean
}

// In-memory storage for demo (replace with database in production)
const sharedQuizzes: SharedQuiz[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === "create") {
      // Teacher creates and shares a quiz
      const shareCode = generateShareCode()
      const sharedQuiz: SharedQuiz = {
        ...data.quiz,
        createdBy: data.teacherId,
        teacherName: data.teacherName,
        shareCode,
        createdAt: new Date(),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        isActive: true,
      }

      sharedQuizzes.push(sharedQuiz)

      return NextResponse.json({
        success: true,
        shareCode,
        quiz: sharedQuiz,
      })
    }

    if (action === "access") {
      // Student accesses quiz via share code
      const quiz = sharedQuizzes.find(
        (q) => q.shareCode === data.shareCode && q.isActive && (!q.expiresAt || q.expiresAt > new Date()),
      )

      if (!quiz) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid or expired share code",
          },
          { status: 404 },
        )
      }

      return NextResponse.json({
        success: true,
        quiz,
      })
    }

    if (action === "list") {
      // Get quizzes created by teacher
      const teacherQuizzes = sharedQuizzes.filter((q) => q.createdBy === data.teacherId)
      return NextResponse.json({
        success: true,
        quizzes: teacherQuizzes,
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
    console.error("Quiz sharing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

function generateShareCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
