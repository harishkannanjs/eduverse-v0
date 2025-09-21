import { type NextRequest, NextResponse } from "next/server"

interface MoodEntry {
  date: string
  mood: "great" | "good" | "okay" | "bad" | "terrible"
  energy: number
  stress: number
  journal: string
  activities: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { moodHistory }: { moodHistory: MoodEntry[] } = await request.json()

    // Generate AI insights based on mood data
    const insights = generateWellnessInsights(moodHistory)

    return NextResponse.json({
      success: true,
      insights,
      message: "Wellness insights generated successfully",
    })
  } catch (error) {
    console.error("Error generating wellness insights:", error)
    return NextResponse.json({ success: false, error: "Failed to generate wellness insights" }, { status: 500 })
  }
}

function generateWellnessInsights(history: MoodEntry[]): string[] {
  const insights: string[] = []

  if (history.length === 0) {
    return ["Start tracking your daily mood to receive personalized insights!"]
  }

  const recentEntries = history.slice(-7) // Last 7 days
  const averageMood = calculateAverageMoodScore(recentEntries)
  const averageEnergy = recentEntries.reduce((sum, entry) => sum + entry.energy, 0) / recentEntries.length
  const averageStress = recentEntries.reduce((sum, entry) => sum + entry.stress, 0) / recentEntries.length

  // Mood trend analysis
  if (averageMood >= 4) {
    insights.push(
      "🌟 Your mood has been consistently positive this week! Keep up the great work with your wellness routine.",
    )
  } else if (averageMood >= 3) {
    insights.push(
      "😊 Your mood is stable and balanced. Consider adding more activities that bring you joy to boost your wellbeing further.",
    )
  } else {
    insights.push(
      "💙 I notice your mood has been lower recently. Remember that it's okay to have difficult days. Consider reaching out to friends, family, or a counselor for support.",
    )
  }

  // Energy level insights
  if (averageEnergy >= 7) {
    insights.push("⚡ Your energy levels are excellent! You're doing a great job maintaining your vitality.")
  } else if (averageEnergy >= 5) {
    insights.push(
      "🔋 Your energy levels are moderate. Try incorporating more physical activity, better sleep habits, or energizing activities into your routine.",
    )
  } else {
    insights.push(
      "😴 Your energy levels seem low. Consider evaluating your sleep schedule, nutrition, and stress levels. Small changes can make a big difference!",
    )
  }

  // Stress management insights
  if (averageStress <= 4) {
    insights.push("🧘 You're managing stress well! Your coping strategies are working effectively.")
  } else if (averageStress <= 6) {
    insights.push(
      "⚖️ Your stress levels are manageable but could be improved. Try incorporating more relaxation techniques like breathing exercises or meditation.",
    )
  } else {
    insights.push(
      "🚨 Your stress levels are quite high. Consider prioritizing stress-reduction activities, and don't hesitate to seek support if you need it.",
    )
  }

  // Activity-based insights
  const commonActivities = findMostCommonActivities(recentEntries)
  if (commonActivities.length > 0) {
    insights.push(
      `🎯 I notice you enjoy ${commonActivities.slice(0, 2).join(" and ")}. These activities seem to positively impact your mood - try to make time for them regularly!`,
    )
  }

  // Pattern recognition
  const moodPattern = analyzeMoodPattern(recentEntries)
  if (moodPattern) {
    insights.push(moodPattern)
  }

  // Recommendations based on data
  if (averageStress > 6 && averageEnergy < 5) {
    insights.push(
      "🌱 High stress and low energy often go together. Try starting your day with a short breathing exercise and ending it with gratitude journaling.",
    )
  }

  if (recentEntries.some((entry) => entry.activities.includes("Exercise")) && averageMood >= 3.5) {
    insights.push(
      "🏃‍♀️ I see that exercise positively impacts your mood! Try to maintain regular physical activity for continued mental health benefits.",
    )
  }

  return insights.slice(0, 5) // Limit to 5 insights
}

function calculateAverageMoodScore(entries: MoodEntry[]): number {
  const moodScores = { terrible: 1, bad: 2, okay: 3, good: 4, great: 5 }
  const totalScore = entries.reduce((sum, entry) => sum + moodScores[entry.mood], 0)
  return totalScore / entries.length
}

function findMostCommonActivities(entries: MoodEntry[]): string[] {
  const activityCount: { [key: string]: number } = {}

  entries.forEach((entry) => {
    entry.activities.forEach((activity) => {
      activityCount[activity] = (activityCount[activity] || 0) + 1
    })
  })

  return Object.entries(activityCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([activity]) => activity)
}

function analyzeMoodPattern(entries: MoodEntry[]): string | null {
  if (entries.length < 3) return null

  const moodScores = { terrible: 1, bad: 2, okay: 3, good: 4, great: 5 }
  const scores = entries.map((entry) => moodScores[entry.mood])

  // Check for improving trend
  const recentScores = scores.slice(-3)
  const isImproving = recentScores.every((score, index) => index === 0 || score >= recentScores[index - 1])

  const isDecreasing = recentScores.every((score, index) => index === 0 || score <= recentScores[index - 1])

  if (isImproving && recentScores[0] < recentScores[recentScores.length - 1]) {
    return "📈 I'm seeing an upward trend in your mood over the past few days. Whatever you're doing is working - keep it up!"
  } else if (isDecreasing && recentScores[0] > recentScores[recentScores.length - 1]) {
    return "📉 Your mood seems to be declining recently. This is a good time to focus on self-care and reach out for support if needed."
  }

  return null
}
