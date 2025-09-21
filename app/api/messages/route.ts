import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/auth"

// Mock data store representing user relationships (in production, this would be in a database)
// This simulates the relationships between users to enforce proper access control
const userRelationships = {
  student_1: {
    // Alex Johnson
    id: "student_1",
    name: "Alex Johnson",
    role: "student",
    parent: "parent_1",
    teachers: ["teacher_1", "teacher_2"],
    peers: ["student_2", "student_3"],
  },
  student_2: {
    // Emma Davis
    id: "student_2",
    name: "Emma Davis",
    role: "student",
    parent: "parent_2",
    teachers: ["teacher_1", "teacher_3"],
    peers: ["student_1", "student_3"],
  },
  parent_1: {
    // Michael Brown (Alex's parent)
    id: "parent_1",
    name: "Michael Brown",
    role: "parent",
    children: ["student_1"],
    childrenTeachers: ["teacher_1", "teacher_2"],
  },
  parent_2: {
    // Sarah Davis (Emma's parent)
    id: "parent_2",
    name: "Sarah Davis",
    role: "parent",
    children: ["student_2"],
    childrenTeachers: ["teacher_1", "teacher_3"],
  },
  teacher_1: {
    // Mrs. Wilson
    id: "teacher_1",
    name: "Mrs. Wilson",
    role: "teacher",
    students: ["student_1", "student_2"],
    parents: ["parent_1", "parent_2"],
    colleagues: ["teacher_2", "teacher_3"],
  },
  teacher_2: {
    // Mr. Davis
    id: "teacher_2",
    name: "Mr. Davis",
    role: "teacher",
    students: ["student_1", "student_3"],
    parents: ["parent_1", "parent_3"],
    colleagues: ["teacher_1", "teacher_3"],
  },
  teacher_3: {
    // Dr. Smith
    id: "teacher_3",
    name: "Dr. Smith",
    role: "teacher",
    students: ["student_2", "student_3"],
    parents: ["parent_2", "parent_3"],
    colleagues: ["teacher_1", "teacher_2"],
  },
}

// Mock conversations - demonstrating proper access control scenarios
const conversations: any[] = [
  {
    id: "1", // Teacher-Parent conversation about Alex
    participants: [
      { id: "teacher_1", name: "Mrs. Wilson", role: "teacher", avatar: "/teacher-avatar.png" },
      { id: "parent_1", name: "Michael Brown", role: "parent", avatar: "/parent-avatar.png" },
    ],
    relatedStudents: ["student_1"], // Alex can see this because it's about him
    lastMessage: "Alex did exceptionally well on today's quiz!",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 1,
    isStarred: true,
  },
  {
    id: "2", // Student-Teacher conversation
    participants: [
      { id: "student_1", name: "Alex Johnson", role: "student", avatar: "/student-avatar.png" },
      { id: "teacher_1", name: "Mrs. Wilson", role: "teacher", avatar: "/teacher-avatar.png" },
    ],
    relatedStudents: ["student_1"],
    lastMessage: "Could you explain the quadratic formula again?",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    unreadCount: 0,
    isStarred: false,
  },
  {
    id: "3", // Another Teacher-Parent conversation about Alex
    participants: [
      { id: "teacher_2", name: "Mr. Davis", role: "teacher", avatar: "/teacher-avatar.png" },
      { id: "parent_1", name: "Michael Brown", role: "parent", avatar: "/parent-avatar.png" },
    ],
    relatedStudents: ["student_1"],
    lastMessage: "Alex might benefit from extra practice with chemical equations",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 2,
    isStarred: false,
  },
  {
    id: "4", // Student-Parent conversation
    participants: [
      { id: "student_1", name: "Alex Johnson", role: "student", avatar: "/student-avatar.png" },
      { id: "parent_1", name: "Michael Brown", role: "parent", avatar: "/parent-avatar.png" },
    ],
    relatedStudents: ["student_1"],
    lastMessage: "Can you help me with my homework tonight?",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    unreadCount: 0,
    isStarred: false,
  },
  {
    id: "5", // Student-Student conversation
    participants: [
      { id: "student_1", name: "Alex Johnson", role: "student", avatar: "/student-avatar.png" },
      { id: "student_2", name: "Emma Davis", role: "student", avatar: "/student-avatar.png" },
    ],
    relatedStudents: ["student_1", "student_2"],
    lastMessage: "Want to study together for the math test?",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    unreadCount: 1,
    isStarred: false,
  },
  {
    id: "6", // Teacher-Parent conversation about Emma (should NOT be visible to Alex)
    participants: [
      { id: "teacher_1", name: "Mrs. Wilson", role: "teacher", avatar: "/teacher-avatar.png" },
      { id: "parent_2", name: "Sarah Davis", role: "parent", avatar: "/parent-avatar.png" },
    ],
    relatedStudents: ["student_2"], // Emma only
    lastMessage: "Emma has been doing great with her reading assignments.",
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    unreadCount: 0,
    isStarred: false,
  },
]

const messages: any[] = [
  {
    id: "1",
    conversationId: "1",
    sender: { id: "teacher_1", name: "Mrs. Wilson", role: "teacher", avatar: "/teacher-avatar.png" },
    content:
      "Alex did exceptionally well on today's quiz! His understanding of quadratic equations has really improved.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: true,
  },
  {
    id: "2",
    conversationId: "1",
    sender: { id: "parent_1", name: "Michael Brown", role: "parent", avatar: "/parent-avatar.png" },
    content: "That's wonderful to hear! We've been working on practice problems at home.",
    timestamp: new Date(Date.now() - 2700000).toISOString(),
    isRead: true,
  },
  {
    id: "3",
    conversationId: "1",
    sender: { id: "teacher_1", name: "Mrs. Wilson", role: "teacher", avatar: "/teacher-avatar.png" },
    content: "It shows! Keep up the great work. I think Alex is ready for more advanced problems.",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    isRead: false,
  },
  {
    id: "4",
    conversationId: "2",
    sender: { id: "student_1", name: "Alex Johnson", role: "student", avatar: "/student-avatar.png" },
    content: "Could you explain the quadratic formula again? I'm having trouble with the discriminant part.",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isRead: true,
  },
  {
    id: "5",
    conversationId: "2",
    sender: { id: "teacher_1", name: "Mrs. Wilson", role: "teacher", avatar: "/teacher-avatar.png" },
    content:
      "Of course! The discriminant is b² - 4ac. It tells us how many real solutions the equation has. Would you like me to work through an example?",
    timestamp: new Date(Date.now() - 6900000).toISOString(),
    isRead: true,
  },
  {
    id: "6",
    conversationId: "4",
    sender: { id: "student_1", name: "Alex Johnson", role: "student", avatar: "/student-avatar.png" },
    content: "Can you help me with my homework tonight?",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    isRead: true,
  },
  {
    id: "7",
    conversationId: "5",
    sender: { id: "student_1", name: "Alex Johnson", role: "student", avatar: "/student-avatar.png" },
    content: "Want to study together for the math test?",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    isRead: false,
  },
]

// Helper function to check if a user can access a conversation
function canUserAccessConversation(userId: string, conversation: any): boolean {
  const user = userRelationships[userId as keyof typeof userRelationships]
  if (!user) return false

  // Check if user is a direct participant
  const isParticipant = conversation.participants.some((p: any) => p.id === userId)
  if (isParticipant) return true

  // For students: can see conversations about them AND conversations with their parents/teachers
  if (user.role === "student") {
    // Can see conversations they're related to
    const isRelatedStudent = conversation.relatedStudents?.includes(userId)
    // Can see conversations between their parent and teachers
    const isParentTeacherConversation =
      conversation.participants.some((p: any) => p.id === (user as any).parent) &&
      conversation.participants.some((p: any) => (user as any).teachers?.includes(p.id))
    return isRelatedStudent || isParentTeacherConversation
  }

  // For parents: can see conversations about their children AND with their children's teachers
  if (user.role === "parent") {
    // Can see conversations about their children
    const isAboutTheirChild = conversation.relatedStudents?.some((studentId: string) =>
      (user as any).children?.includes(studentId),
    )
    // Can see conversations with their children's teachers
    const isWithChildrensTeachers = conversation.participants.some((p: any) =>
      (user as any).childrenTeachers?.includes(p.id),
    )
    return isAboutTheirChild || isWithChildrensTeachers
  }

  // For teachers: can see conversations about their students AND with parents of their students
  if (user.role === "teacher") {
    // Can see conversations about their students
    const isAboutTheirStudents = conversation.relatedStudents?.some((studentId: string) =>
      (user as any).students?.includes(studentId),
    )
    // Can see conversations with parents of their students
    const isWithStudentParents = conversation.participants.some((p: any) => (user as any).parents?.includes(p.id))
    return isAboutTheirStudents || isWithStudentParents
  }

  return false
}

// Get all conversations for a user (with proper role-based filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")
    const clientUserId = searchParams.get("userId")

    // Server-side authentication: Get the actual authenticated user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify the client-supplied userId matches the authenticated user (prevent impersonation)
    if (clientUserId && clientUserId !== currentUser.id) {
      return Response.json({ error: "User ID mismatch" }, { status: 403 })
    }

    const userId = currentUser.id // Use server-validated user ID

    if (conversationId) {
      // Get messages for a specific conversation (check access first)
      const conversation = conversations.find((conv) => conv.id === conversationId)
      if (!conversation || !canUserAccessConversation(userId, conversation)) {
        return Response.json({ error: "Access denied" }, { status: 403 })
      }

      const conversationMessages = messages.filter((msg) => msg.conversationId === conversationId)
      return Response.json({ messages: conversationMessages })
    } else {
      // Get all conversations - filter by user access rights
      const filteredConversations = conversations.filter((conv) => canUserAccessConversation(userId, conv))

      return Response.json({ conversations: filteredConversations })
    }
  } catch (error) {
    console.error("Error fetching messages:", error)
    return Response.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

// Send a new message
export async function POST(request: NextRequest) {
  try {
    const { conversationId, content } = await request.json()

    if (!conversationId || !content) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Server-side authentication: Get the actual authenticated user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    // Use authenticated user data instead of trusting client-supplied sender data
    const senderId = currentUser.id
    const senderName = currentUser.name
    const senderRole = currentUser.role

    // Check if user can access this conversation
    const conversation = conversations.find((conv) => conv.id === conversationId)
    if (!conversation || !canUserAccessConversation(senderId, conversation)) {
      return Response.json({ error: "Access denied" }, { status: 403 })
    }

    // Create new message
    const newMessage = {
      id: Date.now().toString(),
      conversationId,
      sender: {
        id: senderId,
        name: senderName,
        role: senderRole,
        avatar: `/${senderRole}-avatar.png`,
      },
      content: content.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    }

    // Add message to mock store
    messages.push(newMessage)

    // Update conversation's last message and timestamp
    if (conversation) {
      conversation.lastMessage = content.slice(0, 50) + (content.length > 50 ? "..." : "")
      conversation.timestamp = newMessage.timestamp
      conversation.unreadCount += 1
    }

    return Response.json({
      message: newMessage,
      success: true,
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return Response.json({ error: "Failed to send message" }, { status: 500 })
  }
}

// Create a new conversation
export async function PUT(request: NextRequest) {
  try {
    const { participants, initialMessage, createdBy } = await request.json()

    if (!participants || participants.length < 2 || !createdBy) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify the creator can create conversations with these participants
    // (In a real app, this would check relationships and permissions)
    const creator = userRelationships[createdBy as keyof typeof userRelationships]
    if (!creator) {
      return Response.json({ error: "Invalid creator" }, { status: 403 })
    }

    const newConversation = {
      id: Date.now().toString(),
      participants,
      relatedStudents: participants.filter((p: any) => p.role === "student").map((p: any) => p.id),
      lastMessage: initialMessage || "Conversation started",
      timestamp: new Date().toISOString(),
      unreadCount: 0,
      isStarred: false,
    }

    conversations.push(newConversation)

    return Response.json({
      conversation: newConversation,
      success: true,
    })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return Response.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}
