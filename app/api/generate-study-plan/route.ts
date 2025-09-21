import { type NextRequest, NextResponse } from "next/server"

interface StudentProfile {
  subjects: string[]
  percentageScores: { [subject: string]: number }
  difficulties: string[]
  learningStyle: string
  studyGoals: string
  availableHours: number
  preferredStudyTime: string
}

interface StudyPlan {
  id: string
  subject: string
  title: string
  description: string
  estimatedTime: number
  priority: "high" | "medium" | "low"
  type: "concept" | "practice" | "review"
}

export async function POST(request: NextRequest) {
  try {
    const profile: StudentProfile = await request.json()

    // Generate AI-powered study plan based on student profile
    const studyPlan = generatePersonalizedStudyPlan(profile)

    return NextResponse.json({
      success: true,
      studyPlan,
      message: "Study plan generated successfully",
    })
  } catch (error) {
    console.error("Error generating study plan:", error)
    return NextResponse.json({ success: false, error: "Failed to generate study plan" }, { status: 500 })
  }
}

function generatePersonalizedStudyPlan(profile: StudentProfile): StudyPlan[] {
  const plan: StudyPlan[] = []

  // Analyze each subject based on performance
  profile.subjects.forEach((subject) => {
    const score = profile.percentageScores[subject] || 0

    // Low performance - focus on fundamentals
    if (score < 60) {
      plan.push({
        id: `${subject.toLowerCase()}-foundation`,
        subject,
        title: `${subject} Foundation Strengthening`,
        description: `Build strong fundamentals in ${subject} with interactive lessons and guided practice. Focus on core concepts you're struggling with.`,
        estimatedTime: Math.min(profile.availableHours * 60 * 0.4, 60), // 40% of available time, max 60 min
        priority: "high",
        type: "concept",
      })
    }

    // Medium performance - targeted practice
    else if (score < 80) {
      plan.push({
        id: `${subject.toLowerCase()}-practice`,
        subject,
        title: `${subject} Skill Building`,
        description: `Improve your ${subject} performance with targeted practice problems and real-world applications.`,
        estimatedTime: Math.min(profile.availableHours * 60 * 0.3, 45), // 30% of available time, max 45 min
        priority: "medium",
        type: "practice",
      })
    }

    // High performance - advanced challenges
    else {
      plan.push({
        id: `${subject.toLowerCase()}-advanced`,
        subject,
        title: `Advanced ${subject} Challenges`,
        description: `Take your ${subject} skills to the next level with challenging problems and advanced concepts.`,
        estimatedTime: Math.min(profile.availableHours * 60 * 0.25, 40), // 25% of available time, max 40 min
        priority: "medium",
        type: "concept",
      })
    }
  })

  // Add difficulty-specific recommendations
  profile.difficulties.forEach((difficulty) => {
    switch (difficulty) {
      case "Time management":
        plan.push({
          id: "time-management-skills",
          subject: "Study Skills",
          title: "Master Time Management",
          description:
            "Learn proven time management techniques including the Pomodoro Technique, priority matrices, and study scheduling.",
          estimatedTime: 25,
          priority: "high",
          type: "concept",
        })
        break

      case "Test anxiety":
        plan.push({
          id: "test-anxiety-management",
          subject: "Wellness",
          title: "Overcome Test Anxiety",
          description:
            "Practice relaxation techniques, breathing exercises, and test-taking strategies to reduce anxiety and improve performance.",
          estimatedTime: 20,
          priority: "high",
          type: "practice",
        })
        break

      case "Understanding complex concepts":
        plan.push({
          id: "concept-mastery",
          subject: "Study Skills",
          title: "Complex Concept Breakdown",
          description:
            "Learn how to break down complex ideas into manageable parts using mind mapping and visual learning techniques.",
          estimatedTime: 30,
          priority: "high",
          type: "concept",
        })
        break

      case "Memorizing information":
        plan.push({
          id: "memory-techniques",
          subject: "Study Skills",
          title: "Memory Enhancement Techniques",
          description: "Master memory techniques like spaced repetition, mnemonics, and the memory palace method.",
          estimatedTime: 25,
          priority: "medium",
          type: "practice",
        })
        break

      case "Staying motivated":
        plan.push({
          id: "motivation-strategies",
          subject: "Personal Development",
          title: "Build Study Motivation",
          description: "Develop intrinsic motivation through goal setting, progress tracking, and reward systems.",
          estimatedTime: 20,
          priority: "medium",
          type: "concept",
        })
        break
    }
  })

  // Customize based on learning style
  if (profile.learningStyle === "visual") {
    plan.push({
      id: "visual-learning-tools",
      subject: "Study Skills",
      title: "Visual Learning Mastery",
      description:
        "Maximize your visual learning style with mind maps, diagrams, color coding, and infographic creation.",
      estimatedTime: 20,
      priority: "medium",
      type: "concept",
    })
  } else if (profile.learningStyle === "auditory") {
    plan.push({
      id: "auditory-learning-tools",
      subject: "Study Skills",
      title: "Auditory Learning Techniques",
      description:
        "Leverage your auditory learning style with recorded lectures, discussion groups, and verbal repetition techniques.",
      estimatedTime: 20,
      priority: "medium",
      type: "concept",
    })
  } else if (profile.learningStyle === "kinesthetic") {
    plan.push({
      id: "kinesthetic-learning-tools",
      subject: "Study Skills",
      title: "Hands-On Learning Strategies",
      description:
        "Engage your kinesthetic learning style with interactive simulations, physical models, and movement-based learning.",
      estimatedTime: 25,
      priority: "medium",
      type: "practice",
    })
  }

  // Sort by priority and limit to reasonable number
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  return plan.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]).slice(0, 8) // Limit to 8 recommendations
}
