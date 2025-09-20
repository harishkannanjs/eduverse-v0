import { streamChat } from "@/lib/gemini-client"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // Check if Gemini is configured
    if (!process.env.GEMINI_API_KEY) {
      return new Response("AI service not configured", { status: 500 })
    }

    // Get authenticated user from session - skip for now to allow testing
    // const { data: { user }, error: authError } = await supabase.auth.getUser()
    // if (authError || !user) {
    //   return new Response("Unauthorized", { status: 401 })
    // }

    // Get user profile for personalized context (use default for now)
    // const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const { messages } = await req.json()

    // Add personalized educational context to the system message
    const userRole = "student" // profile?.role || "student"
    const userName = "User" // profile?.full_name || "there"
    
    const systemMessage = `You are an AI tutor for EduVerse, an educational platform. You are helping ${userName}, who is a ${userRole}.

As their personal AI tutor, you help with:
- Academic questions and explanations
- Study guidance and learning strategies  
- Educational content creation
- Progress tracking insights
- Homework help and problem-solving

Tailor your responses to their role:
- For students: Focus on learning concepts, study tips, and homework help
- For teachers: Assist with lesson planning, educational strategies, and student engagement
- For parents: Provide insights on supporting their child's education and understanding progress

Always be encouraging, educational, and age-appropriate. Provide clear explanations and examples when possible. Address them by name when appropriate.`

    const response = await streamChat(messages, systemMessage, req.signal)
    
    // Return JSON response that the client expects
    return Response.json({ response })
  } catch (error) {
    console.error("AI chat error:", error)
    return new Response("Failed to process chat request", { status: 500 })
  }
}
