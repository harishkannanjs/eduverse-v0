// Database integration layer for EduVerse
// This module provides type-safe database operations and queries

export interface DatabaseUser {
  id: string
  email: string
  name: string
  role: "student" | "teacher" | "parent"
  password?: string // Added password field for authentication
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface DatabaseStudent {
  id: string
  user_id: string
  grade_level?: number
  learning_style?: "visual" | "auditory" | "kinesthetic" | "mixed"
  parent_id?: string
  user?: DatabaseUser
  parent?: DatabaseUser
}

export interface DatabaseTeacher {
  id: string
  user_id: string
  department?: string
  specialization?: string[]
  years_experience?: number
  user?: DatabaseUser
}

export interface DatabaseClass {
  id: string
  name: string
  subject_id: string
  teacher_id: string
  room_number?: string
  schedule?: Record<string, any>
  max_students: number
  subject?: DatabaseSubject
  teacher?: DatabaseTeacher
}

export interface DatabaseSubject {
  id: string
  name: string
  description?: string
}

export interface DatabaseLesson {
  id: string
  title: string
  description?: string
  content?: Record<string, any>
  class_id: string
  lesson_order: number
  duration_minutes: number
  objectives?: string[]
  resources?: Record<string, any>
}

export interface DatabaseAssignment {
  id: string
  title: string
  description?: string
  class_id: string
  lesson_id?: string
  assignment_type: "homework" | "quiz" | "test" | "project" | "discussion"
  due_date?: string
  max_points: number
  instructions?: Record<string, any>
}

export interface DatabaseStudentProgress {
  id: string
  student_id: string
  lesson_id: string
  completion_percentage: number
  time_spent_minutes: number
  last_accessed: string
  completed_at?: string
  lesson?: DatabaseLesson
}

export interface DatabaseMessage {
  id: string
  sender_id: string
  conversation_id: string
  content: string
  message_type: "text" | "file" | "image" | "video"
  attachments?: Record<string, any>
  sent_at: string
  read_at?: string
  sender?: DatabaseUser
}

export interface DatabaseConversation {
  id: string
  title?: string
  conversation_type: "direct" | "group" | "class" | "announcement"
  created_by: string
  created_at: string
  updated_at: string
  participants?: DatabaseUser[]
  last_message?: DatabaseMessage
}

export interface DatabaseAIInsight {
  id: string
  user_id: string
  insight_type: "recommendation" | "alert" | "achievement" | "trend" | "wellness"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  actionable: boolean
  metadata?: Record<string, any>
  is_read: boolean
  created_at: string
  expires_at?: string
}

export interface DatabaseStudentAnalytics {
  id: string
  student_id: string
  subject_id: string
  date_recorded: string
  scores?: number[]
  time_spent_minutes: number
  lessons_completed: number
  assignments_completed: number
  strengths?: string[]
  weaknesses?: string[]
  learning_velocity?: number
  engagement_score?: number
  subject?: DatabaseSubject
}

export interface DatabaseWellnessData {
  id: string
  student_id: string
  date_recorded: string
  mood_rating?: number
  stress_level?: number
  sleep_hours?: number
  study_hours?: number
  physical_activity_minutes?: number
  notes?: string
}

export interface DatabaseAnnouncement {
  id: string
  title: string
  content: string
  author_id: string
  target_audience: "all" | "students" | "teachers" | "parents" | "class"
  target_class_id?: string
  priority: "high" | "medium" | "low"
  published_at: string
  expires_at?: string
  is_active: boolean
  author?: DatabaseUser
}

export interface DatabaseStudyGroup {
  id: string
  name: string
  description?: string
  subject_id: string
  created_by: string
  max_members: number
  is_active: boolean
  meeting_schedule?: Record<string, any>
  subject?: DatabaseSubject
  creator?: DatabaseUser
  member_count?: number
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  role: "student" | "teacher" | "parent"
}

// Database query functions (mock implementation for demonstration)
// In a real application, these would connect to your actual database

export class DatabaseService {
  private static registeredUsers: DatabaseUser[] = []

  // User operations
  static async getUserById(id: string): Promise<DatabaseUser | null> {
    // Mock implementation - in production, this would query your database
    const mockUsers: DatabaseUser[] = [
      {
        id: "550e8400-e29b-41d4-a716-446655440010",
        email: "alex.johnson@student.edu",
        name: "Alex Johnson",
        role: "student",
        password: "ZGVtb2VkdXZlcnNlX3NhbHQ=", // "demo" hashed
        avatar_url: "/student-avatar.png",
        created_at: "2024-09-01T00:00:00Z",
        updated_at: "2024-09-01T00:00:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440020",
        email: "sarah.wilson@teacher.edu",
        name: "Sarah Wilson",
        role: "teacher",
        password: "ZGVtb2VkdXZlcnNlX3NhbHQ=", // "demo" hashed
        avatar_url: "/teacher-avatar.png",
        created_at: "2024-09-01T00:00:00Z",
        updated_at: "2024-09-01T00:00:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440030",
        email: "michael.brown@parent.edu",
        name: "Michael Brown",
        role: "parent",
        password: "ZGVtb2VkdXZlcnNlX3NhbHQ=", // "demo" hashed
        avatar_url: "/parent-avatar.png",
        created_at: "2024-09-01T00:00:00Z",
        updated_at: "2024-09-01T00:00:00Z",
      },
    ]

    return mockUsers.find((user) => user.id === id) || null
  }

  static async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    // Check registered users first
    const registeredUser = this.registeredUsers.find((user) => user.email === email)
    if (registeredUser) {
      return registeredUser
    }

    // Fallback to mock users for demo
    const mockUsers: DatabaseUser[] = [
      {
        id: "550e8400-e29b-41d4-a716-446655440010",
        email: "alex.johnson@student.edu",
        name: "Alex Johnson",
        role: "student",
        password: "ZGVtb2VkdXZlcnNlX3NhbHQ=", // "demo" hashed
        avatar_url: "/student-avatar.png",
        created_at: "2024-09-01T00:00:00Z",
        updated_at: "2024-09-01T00:00:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440020",
        email: "sarah.wilson@teacher.edu",
        name: "Sarah Wilson",
        role: "teacher",
        password: "ZGVtb2VkdXZlcnNlX3NhbHQ=", // "demo" hashed
        avatar_url: "/teacher-avatar.png",
        created_at: "2024-09-01T00:00:00Z",
        updated_at: "2024-09-01T00:00:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440030",
        email: "michael.brown@parent.edu",
        name: "Michael Brown",
        role: "parent",
        password: "ZGVtb2VkdXZlcnNlX3NhbHQ=", // "demo" hashed
        avatar_url: "/parent-avatar.png",
        created_at: "2024-09-01T00:00:00Z",
        updated_at: "2024-09-01T00:00:00Z",
      },
    ]

    return mockUsers.find((user) => user.email === email) || null
  }

  // Student operations
  static async getStudentByUserId(userId: string): Promise<DatabaseStudent | null> {
    // Mock implementation
    if (userId === "550e8400-e29b-41d4-a716-446655440010") {
      return {
        id: "550e8400-e29b-41d4-a716-446655440050",
        user_id: userId,
        grade_level: 10,
        learning_style: "visual",
        parent_id: "550e8400-e29b-41d4-a716-446655440030",
      }
    }
    return null
  }

  // Class operations
  static async getClassesByTeacherId(teacherId: string): Promise<DatabaseClass[]> {
    // Mock implementation
    return [
      {
        id: "550e8400-e29b-41d4-a716-446655440060",
        name: "Algebra II - Period 3",
        subject_id: "550e8400-e29b-41d4-a716-446655440001",
        teacher_id: teacherId,
        room_number: "204",
        schedule: { days: ["Monday", "Wednesday", "Friday"], time: "10:30-11:30" },
        max_students: 28,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440061",
        name: "Pre-Calculus - Period 5",
        subject_id: "550e8400-e29b-41d4-a716-446655440001",
        teacher_id: teacherId,
        room_number: "204",
        schedule: { days: ["Tuesday", "Thursday"], time: "13:00-14:00" },
        max_students: 24,
      },
    ]
  }

  static async getClassesByStudentId(studentId: string): Promise<DatabaseClass[]> {
    // Mock implementation
    return [
      {
        id: "550e8400-e29b-41d4-a716-446655440060",
        name: "Algebra II - Period 3",
        subject_id: "550e8400-e29b-41d4-a716-446655440001",
        teacher_id: "550e8400-e29b-41d4-a716-446655440040",
        room_number: "204",
        schedule: { days: ["Monday", "Wednesday", "Friday"], time: "10:30-11:30" },
        max_students: 28,
      },
    ]
  }

  // Assignment operations
  static async getAssignmentsByClassId(classId: string): Promise<DatabaseAssignment[]> {
    // Mock implementation
    return [
      {
        id: "550e8400-e29b-41d4-a716-446655440080",
        title: "Quadratic Equations Quiz",
        description: "Test your understanding of quadratic equations",
        class_id: classId,
        lesson_id: "550e8400-e29b-41d4-a716-446655440070",
        assignment_type: "quiz",
        due_date: "2024-12-20T23:59:00Z",
        max_points: 100,
        instructions: { questions: 15, time_limit: 45, topics: ["factoring", "graphing", "applications"] },
      },
    ]
  }

  // Progress operations
  static async getStudentProgress(studentId: string): Promise<DatabaseStudentProgress[]> {
    // Mock implementation
    return [
      {
        id: "1",
        student_id: studentId,
        lesson_id: "550e8400-e29b-41d4-a716-446655440070",
        completion_percentage: 100,
        time_spent_minutes: 65,
        last_accessed: "2024-12-15T14:30:00Z",
        completed_at: "2024-12-15T14:30:00Z",
      },
      {
        id: "2",
        student_id: studentId,
        lesson_id: "550e8400-e29b-41d4-a716-446655440071",
        completion_percentage: 75,
        time_spent_minutes: 45,
        last_accessed: "2024-12-16T10:15:00Z",
      },
    ]
  }

  // Analytics operations
  static async getStudentAnalytics(studentId: string): Promise<DatabaseStudentAnalytics[]> {
    // Mock implementation
    return [
      {
        id: "1",
        student_id: studentId,
        subject_id: "550e8400-e29b-41d4-a716-446655440001",
        date_recorded: "2024-12-16",
        scores: [78, 82, 85, 88, 92, 89, 94],
        time_spent_minutes: 360,
        lessons_completed: 12,
        assignments_completed: 8,
        strengths: ["Problem solving", "Logical reasoning", "Pattern recognition"],
        weaknesses: ["Word problems", "Time management"],
        learning_velocity: 2.5,
        engagement_score: 85,
      },
    ]
  }

  // AI Insights operations
  static async getAIInsightsByUserId(userId: string): Promise<DatabaseAIInsight[]> {
    // Mock implementation
    return [
      {
        id: "1",
        user_id: userId,
        insight_type: "recommendation",
        title: "Focus on Quadratic Equations",
        description:
          "Based on your recent quiz results, spending more time on quadratic equations could improve your algebra scores by 15%.",
        priority: "medium",
        actionable: true,
        metadata: {
          suggested_resources: ["khan_academy_quadratics", "practice_worksheets"],
          estimated_improvement: 15,
        },
        is_read: false,
        created_at: "2024-12-16T10:00:00Z",
      },
    ]
  }

  // Conversation operations
  static async getConversationsByUserId(userId: string): Promise<DatabaseConversation[]> {
    // Mock implementation
    return [
      {
        id: "550e8400-e29b-41d4-a716-446655440090",
        title: "Math Help - Alex & Mrs. Wilson",
        conversation_type: "direct",
        created_by: userId,
        created_at: "2024-12-16T14:00:00Z",
        updated_at: "2024-12-16T14:45:00Z",
      },
    ]
  }

  // Announcement operations
  static async getActiveAnnouncements(targetAudience?: string): Promise<DatabaseAnnouncement[]> {
    // Mock implementation
    return [
      {
        id: "1",
        title: "Parent-Teacher Conference Week",
        content: "Virtual conferences are scheduled for next week. Please check your email for time slots.",
        author_id: "550e8400-e29b-41d4-a716-446655440020",
        target_audience: "parents",
        priority: "high",
        published_at: "2024-12-16T08:00:00Z",
        expires_at: "2024-12-23T23:59:00Z",
        is_active: true,
      },
    ]
  }

  // Study Group operations
  static async getStudyGroups(): Promise<DatabaseStudyGroup[]> {
    // Mock implementation
    return [
      {
        id: "550e8400-e29b-41d4-a716-446655440100",
        name: "Chemistry Champions",
        description: "Study group for advanced chemistry topics and lab work preparation.",
        subject_id: "550e8400-e29b-41d4-a716-446655440002",
        created_by: "550e8400-e29b-41d4-a716-446655440021",
        max_members: 12,
        is_active: true,
        meeting_schedule: { days: ["Wednesday", "Friday"], time: "15:30-16:30", location: "Library Room 201" },
        member_count: 8,
      },
    ]
  }

  // Wellness operations
  static async getWellnessData(studentId: string, days = 7): Promise<DatabaseWellnessData[]> {
    // Mock implementation
    return [
      {
        id: "1",
        student_id: studentId,
        date_recorded: "2024-12-16",
        mood_rating: 8,
        stress_level: 4,
        sleep_hours: 7.5,
        study_hours: 3.5,
        physical_activity_minutes: 45,
        notes: "Feeling confident about math quiz tomorrow",
      },
    ]
  }

  static async createUser(userData: CreateUserData): Promise<DatabaseUser | null> {
    try {
      // Generate unique ID
      const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Set avatar based on role
      const avatarMap = {
        student: "/student-avatar.png",
        teacher: "/teacher-avatar.png",
        parent: "/parent-avatar.png",
      }

      const newUser: DatabaseUser = {
        id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password: userData.password,
        avatar_url: avatarMap[userData.role],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Store in memory (in production, this would be a database insert)
      this.registeredUsers.push(newUser)

      console.log("[v0] User registered successfully:", { id: newUser.id, email: newUser.email, role: newUser.role })

      return newUser
    } catch (error) {
      console.error("Error creating user:", error)
      return null
    }
  }
}
