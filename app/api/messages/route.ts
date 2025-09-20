import { createClient } from "@/lib/supabase/server"
import { NextRequest } from "next/server"

// Mock data store (in production, this would be in a database)
let conversations: any[] = [
  {
    id: "1",
    participants: [
      { id: "teacher_1", name: "Mrs. Wilson", role: "teacher", avatar: "/teacher-avatar.png" },
      { id: "parent_1", name: "Michael Brown", role: "parent", avatar: "/parent-avatar.png" },
    ],
    lastMessage: "Alex did exceptionally well on today's quiz!",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    unreadCount: 1,
    isStarred: true,
  },
  {
    id: "2", 
    participants: [
      { id: "student_1", name: "Alex Johnson", role: "student", avatar: "/student-avatar.png" },
      { id: "teacher_1", name: "Mrs. Wilson", role: "teacher", avatar: "/teacher-avatar.png" },
    ],
    lastMessage: "Could you explain the quadratic formula again?",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    unreadCount: 0,
    isStarred: false,
  },
  {
    id: "3",
    participants: [
      { id: "teacher_2", name: "Mr. Davis", role: "teacher", avatar: "/teacher-avatar.png" },
      { id: "parent_1", name: "Michael Brown", role: "parent", avatar: "/parent-avatar.png" },
    ],
    lastMessage: "Alex might benefit from extra practice with chemical equations",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    unreadCount: 2,
    isStarred: false,
  },
]

let messages: any[] = [
  {
    id: "1",
    conversationId: "1",
    sender: { id: "teacher_1", name: "Mrs. Wilson", role: "teacher", avatar: "/teacher-avatar.png" },
    content: "Alex did exceptionally well on today's quiz! His understanding of quadratic equations has really improved.",
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
    content: "Of course! The discriminant is b² - 4ac. It tells us how many real solutions the equation has. Would you like me to work through an example?",
    timestamp: new Date(Date.now() - 6900000).toISOString(),
    isRead: true,
  },
]

// Get all conversations for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    
    if (conversationId) {
      // Get messages for a specific conversation
      const conversationMessages = messages.filter(msg => msg.conversationId === conversationId)
      return Response.json({ messages: conversationMessages })
    } else {
      // Get all conversations
      return Response.json({ conversations })
    }
  } catch (error) {
    console.error("Error fetching messages:", error)
    return Response.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

// Send a new message
export async function POST(request: NextRequest) {
  try {
    const { conversationId, content, senderId, senderName, senderRole } = await request.json()
    
    if (!conversationId || !content || !senderId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new message
    const newMessage = {
      id: Date.now().toString(),
      conversationId,
      sender: {
        id: senderId,
        name: senderName || "Anonymous User",
        role: senderRole || "student",
        avatar: `/${senderRole || "student"}-avatar.png`
      },
      content: content.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    }
    
    // Add message to mock store
    messages.push(newMessage)
    
    // Update conversation's last message and timestamp
    const conversation = conversations.find(conv => conv.id === conversationId)
    if (conversation) {
      conversation.lastMessage = content.slice(0, 50) + (content.length > 50 ? "..." : "")
      conversation.timestamp = newMessage.timestamp
      conversation.unreadCount += 1
    }
    
    return Response.json({ 
      message: newMessage,
      success: true 
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return Response.json({ error: "Failed to send message" }, { status: 500 })
  }
}

// Create a new conversation
export async function PUT(request: NextRequest) {
  try {
    const { participants, initialMessage } = await request.json()
    
    if (!participants || participants.length < 2) {
      return Response.json({ error: "At least 2 participants required" }, { status: 400 })
    }

    const newConversation = {
      id: Date.now().toString(),
      participants,
      lastMessage: initialMessage || "Conversation started",
      timestamp: new Date().toISOString(),
      unreadCount: 0,
      isStarred: false,
    }
    
    conversations.push(newConversation)
    
    return Response.json({ 
      conversation: newConversation,
      success: true 
    })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return Response.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}