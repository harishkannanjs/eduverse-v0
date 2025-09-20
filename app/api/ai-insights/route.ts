import { generateInsight } from "@/lib/gemini-client"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { type, userId } = await req.json()
    
    // Check if Gemini is configured
    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "AI service not configured" }, { status: 500 })
    }

    const supabase = await createClient()

    // Skip authentication for now to allow testing
    // const { data: { user }, error: authError } = await supabase.auth.getUser()
    // if (authError || !user) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // Mock user data for demonstration (replace with real data when auth is working)
    const mockProgress = [
      {
        subject: "Mathematics",
        grade: 92,
        completed_lessons: 12,
        total_lessons: 15,
        last_activity: "2025-01-15",
        strengths: ["Algebra", "Problem Solving"],
        weaknesses: ["Geometry"]
      },
      {
        subject: "History", 
        grade: 88,
        completed_lessons: 8,
        total_lessons: 10,
        last_activity: "2025-01-14",
        strengths: ["Research", "Essay Writing"],
        weaknesses: ["Timeline memorization"]
      },
      {
        subject: "Chemistry",
        grade: 78,
        completed_lessons: 6,
        total_lessons: 12,
        last_activity: "2025-01-13",
        strengths: ["Lab procedures"],
        weaknesses: ["Chemical equations", "Balancing reactions"]
      }
    ]

    const insight = await generateInsight(type, mockProgress)

    return Response.json({ insight })
  } catch (error) {
    console.error("AI insights error:", error)
    return Response.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
