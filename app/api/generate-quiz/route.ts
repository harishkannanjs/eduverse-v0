import { type NextRequest, NextResponse } from "next/server"

interface StudentProfile {
  subjects: string[]
  percentageScores: { [subject: string]: number }
  difficulties: string[]
  learningStyle: string
}

interface QuizResult {
  quizId: string
  score: number
  totalQuestions: number
  timeSpent: number
  answers: { [questionId: string]: string | string[] }
  completedAt: Date
}

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

export async function POST(request: NextRequest) {
  try {
    const { studentProfile, quizHistory, preferences } = await request.json()

    const quiz = generatePersonalizedQuiz(studentProfile, quizHistory, preferences)

    return NextResponse.json({
      success: true,
      quiz,
      message: "Quiz generated successfully",
    })
  } catch (error) {
    console.error("Error generating quiz:", error)
    return NextResponse.json({ success: false, error: "Failed to generate quiz" }, { status: 500 })
  }
}

function generatePersonalizedQuiz(
  profile: StudentProfile,
  history: QuizResult[],
  preferences: { subject?: string; difficulty?: string },
): Quiz {
  // Determine subject based on preferences or weakest performance
  let targetSubject = preferences.subject
  if (!targetSubject) {
    const subjectScores = profile.subjects.map((subject) => ({
      subject,
      score: profile.percentageScores[subject] || 50,
    }))
    subjectScores.sort((a, b) => a.score - b.score)
    targetSubject = subjectScores[0].subject
  }

  // Determine difficulty based on preferences or performance
  let targetDifficulty = preferences.difficulty as "easy" | "medium" | "hard"
  if (!targetDifficulty) {
    const subjectScore = profile.percentageScores[targetSubject] || 50
    if (subjectScore < 60) targetDifficulty = "easy"
    else if (subjectScore < 80) targetDifficulty = "medium"
    else targetDifficulty = "hard"
  }

  // Generate questions based on subject and student's difficulties
  const questions = generateQuestionsForSubject(targetSubject, targetDifficulty, profile)

  const quiz: Quiz = {
    id: `quiz-${Date.now()}`,
    title: `${targetSubject} ${targetDifficulty.charAt(0).toUpperCase() + targetDifficulty.slice(1)} Assessment`,
    subject: targetSubject,
    difficulty: targetDifficulty,
    questions,
    timeLimit: calculateTimeLimit(questions.length, targetDifficulty),
    description: `A personalized ${targetDifficulty} level quiz for ${targetSubject} based on your learning profile and performance history.`,
  }

  return quiz
}

function generateQuestionsForSubject(
  subject: string,
  difficulty: "easy" | "medium" | "hard",
  profile: StudentProfile,
): Question[] {
  const questions: Question[] = []
  const questionCount = difficulty === "easy" ? 5 : difficulty === "medium" ? 8 : 10

  // Question templates based on subject
  const questionTemplates = getQuestionTemplates(subject, difficulty)

  // Add questions addressing student's specific difficulties
  if (profile.difficulties.includes("Understanding complex concepts")) {
    questions.push(generateConceptualQuestion(subject, difficulty))
  }

  if (profile.difficulties.includes("Problem-solving skills")) {
    questions.push(generateProblemSolvingQuestion(subject, difficulty))
  }

  if (profile.difficulties.includes("Memorizing information")) {
    questions.push(generateMemoryQuestion(subject, difficulty))
  }

  // Fill remaining slots with general questions
  while (questions.length < questionCount) {
    const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)]
    questions.push({
      id: `q${questions.length + 1}`,
      ...template,
      difficulty,
      subject,
    })
  }

  return questions.slice(0, questionCount)
}

function getQuestionTemplates(subject: string, difficulty: "easy" | "medium" | "hard") {
  const templates: Partial<Question>[] = []

  switch (subject.toLowerCase()) {
    case "mathematics":
      templates.push(
        {
          type: "multiple-choice",
          question: "What is the result of 15 + 27?",
          options: ["42", "41", "43", "40"],
          correctAnswer: "42",
          explanation: "15 + 27 = 42. This is basic addition.",
          topic: "Arithmetic",
        },
        {
          type: "multiple-choice",
          question: "Which of the following is a prime number?",
          options: ["15", "17", "21", "25"],
          correctAnswer: "17",
          explanation: "17 is prime because it's only divisible by 1 and itself.",
          topic: "Number Theory",
        },
        {
          type: "short-answer",
          question: "Solve for x: 2x + 5 = 13",
          correctAnswer: "4",
          explanation: "2x + 5 = 13, so 2x = 8, therefore x = 4.",
          topic: "Algebra",
        },
      )
      break

    case "science":
      templates.push(
        {
          type: "multiple-choice",
          question: "What is the chemical symbol for water?",
          options: ["H2O", "CO2", "NaCl", "O2"],
          correctAnswer: "H2O",
          explanation: "Water consists of two hydrogen atoms and one oxygen atom.",
          topic: "Chemistry",
        },
        {
          type: "true-false",
          question: "The Earth revolves around the Sun.",
          correctAnswer: "true",
          explanation: "The Earth orbits the Sun in approximately 365.25 days.",
          topic: "Astronomy",
        },
        {
          type: "short-answer",
          question: "Name the process by which plants make their own food.",
          correctAnswer: "photosynthesis",
          explanation: "Photosynthesis is the process where plants use sunlight to convert CO2 and water into glucose.",
          topic: "Biology",
        },
      )
      break

    case "english":
      templates.push(
        {
          type: "multiple-choice",
          question: "Which of the following is a noun?",
          options: ["quickly", "beautiful", "happiness", "running"],
          correctAnswer: "happiness",
          explanation: "Happiness is a noun representing a state of being or emotion.",
          topic: "Grammar",
        },
        {
          type: "multiple-choice",
          question: "What is the main theme of Romeo and Juliet?",
          options: ["Friendship", "Love and tragedy", "Adventure", "Comedy"],
          correctAnswer: "Love and tragedy",
          explanation: "Romeo and Juliet is primarily about tragic love between two young people.",
          topic: "Literature",
        },
        {
          type: "short-answer",
          question: "Define the term 'metaphor' and give an example.",
          correctAnswer:
            "A metaphor is a figure of speech that compares two things without using 'like' or 'as'. Example: 'Life is a journey.'",
          explanation: "Metaphors create implicit comparisons to help explain or describe something.",
          topic: "Literary Devices",
        },
      )
      break

    default:
      templates.push(
        {
          type: "multiple-choice",
          question: `What is a key concept in ${subject}?`,
          options: ["Theory", "Practice", "Application", "All of the above"],
          correctAnswer: "All of the above",
          explanation: `${subject} encompasses theory, practice, and application.`,
          topic: "Fundamentals",
        },
        {
          type: "true-false",
          question: `${subject} requires critical thinking skills.`,
          correctAnswer: "true",
          explanation: "Critical thinking is essential in all academic subjects.",
          topic: "Skills",
        },
      )
  }

  return templates
}

function generateConceptualQuestion(subject: string, difficulty: "easy" | "medium" | "hard"): Question {
  return {
    id: `concept-${Date.now()}`,
    type: "essay",
    question: `Explain a fundamental concept in ${subject} and provide an example of how it applies in real life.`,
    correctAnswer: "Various answers accepted based on understanding demonstrated",
    explanation: "This question tests conceptual understanding and application skills.",
    difficulty,
    subject,
    topic: "Conceptual Understanding",
  }
}

function generateProblemSolvingQuestion(subject: string, difficulty: "easy" | "medium" | "hard"): Question {
  return {
    id: `problem-${Date.now()}`,
    type: "short-answer",
    question: `Describe the steps you would take to solve a complex problem in ${subject}.`,
    correctAnswer: "Systematic approach with clear steps and reasoning",
    explanation: "This question assesses problem-solving methodology and logical thinking.",
    difficulty,
    subject,
    topic: "Problem Solving",
  }
}

function generateMemoryQuestion(subject: string, difficulty: "easy" | "medium" | "hard"): Question {
  return {
    id: `memory-${Date.now()}`,
    type: "multiple-choice",
    question: `Which memory technique would be most effective for learning ${subject} terminology?`,
    options: ["Repetition", "Mnemonics", "Visual associations", "All of the above"],
    correctAnswer: "All of the above",
    explanation: "Different memory techniques work for different people and types of information.",
    difficulty,
    subject,
    topic: "Study Techniques",
  }
}

function calculateTimeLimit(questionCount: number, difficulty: "easy" | "medium" | "hard"): number {
  const baseTimePerQuestion = difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 4
  return questionCount * baseTimePerQuestion
}
