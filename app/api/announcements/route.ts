import { NextRequest } from "next/server"

// Mock announcements data with proper role-based access control
let announcements: any[] = [
  {
    id: "1",
    title: "Parent-Teacher Conference Week",
    content: "Virtual conferences scheduled for next week. Please check your email for time slots.",
    author: { id: "teacher_1", name: "Mrs. Wilson", role: "teacher" },
    targetAudience: "all", // visible to all roles
    priority: "high",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    isActive: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "2",
    title: "Math Department Update",
    content: "New interactive learning tools have been added to the algebra curriculum.",
    author: { id: "teacher_1", name: "Mrs. Wilson", role: "teacher" },
    targetAudience: "students", // only visible to students and teachers
    priority: "medium",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    isActive: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Wellness Week Activities",
    content: "Join us for mindfulness sessions and stress management workshops this week.",
    author: { id: "teacher_3", name: "Dr. Smith", role: "teacher" },
    targetAudience: "all",
    priority: "low",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    isActive: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "4",
    title: "Science Fair Registration Open",
    content: "Students can now register for the annual science fair. Registration deadline is next Friday.",
    author: { id: "teacher_2", name: "Mr. Davis", role: "teacher" },
    targetAudience: "students",
    priority: "medium",
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    isActive: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "5",
    title: "Parent Feedback Survey",
    content: "We value your feedback! Please complete our quarterly parent satisfaction survey.",
    author: { id: "teacher_1", name: "Mrs. Wilson", role: "teacher" },
    targetAudience: "parents",
    priority: "medium",
    timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    isActive: true,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
]

// Helper function to filter announcements based on user role
function getAnnouncementsForRole(role: string): any[] {
  return announcements.filter(announcement => {
    if (!announcement.isActive) return false
    
    switch (announcement.targetAudience) {
      case "all":
        return true
      case "students":
        return ["student", "teacher"].includes(role) // Teachers can see student announcements
      case "teachers":
        return ["teacher"].includes(role)
      case "parents":
        return ["parent", "teacher"].includes(role) // Teachers can see parent announcements
      default:
        return false
    }
  })
}

// Get announcements for a specific role
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    
    if (!role) {
      return Response.json({ error: "Role parameter is required" }, { status: 400 })
    }

    const filteredAnnouncements = getAnnouncementsForRole(role)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Sort by newest first
    
    return Response.json({ announcements: filteredAnnouncements })
  } catch (error) {
    console.error("Error fetching announcements:", error)
    return Response.json({ error: "Failed to fetch announcements" }, { status: 500 })
  }
}

// Create a new announcement (teachers only)
export async function POST(request: NextRequest) {
  try {
    const { title, content, authorId, authorName, targetAudience, priority = "medium" } = await request.json()
    
    if (!title || !content || !authorId || !authorName || !targetAudience) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify the author is a teacher (in a real app, this would be validated from the session)
    // For now, we'll check based on the authorId pattern or assume it's validated
    // In production, you would get the user's role from the authenticated session
    
    const validTargetAudiences = ["all", "students", "teachers", "parents"]
    if (!validTargetAudiences.includes(targetAudience)) {
      return Response.json({ error: "Invalid target audience" }, { status: 400 })
    }

    const validPriorities = ["high", "medium", "low"]
    if (!validPriorities.includes(priority)) {
      return Response.json({ error: "Invalid priority" }, { status: 400 })
    }

    const newAnnouncement = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      author: { id: authorId, name: authorName, role: "teacher" },
      targetAudience,
      priority,
      timestamp: new Date().toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    
    announcements.push(newAnnouncement)
    
    return Response.json({ 
      announcement: newAnnouncement,
      success: true 
    })
  } catch (error) {
    console.error("Error creating announcement:", error)
    return Response.json({ error: "Failed to create announcement" }, { status: 500 })
  }
}

// Update an announcement (teachers only, and only their own announcements)
export async function PUT(request: NextRequest) {
  try {
    const { id, title, content, authorId, targetAudience, priority, isActive } = await request.json()
    
    if (!id || !authorId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const announcementIndex = announcements.findIndex(a => a.id === id)
    if (announcementIndex === -1) {
      return Response.json({ error: "Announcement not found" }, { status: 404 })
    }

    const announcement = announcements[announcementIndex]
    
    // Check if the user is the author of this announcement
    if (announcement.author.id !== authorId) {
      return Response.json({ error: "You can only edit your own announcements" }, { status: 403 })
    }

    // Update the announcement
    if (title) announcement.title = title.trim()
    if (content) announcement.content = content.trim()
    if (targetAudience) announcement.targetAudience = targetAudience
    if (priority) announcement.priority = priority
    if (typeof isActive === 'boolean') announcement.isActive = isActive
    
    announcement.timestamp = new Date().toISOString()
    
    return Response.json({ 
      announcement,
      success: true 
    })
  } catch (error) {
    console.error("Error updating announcement:", error)
    return Response.json({ error: "Failed to update announcement" }, { status: 500 })
  }
}

// Delete an announcement (teachers only, and only their own announcements)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const authorId = searchParams.get('authorId')
    
    if (!id || !authorId) {
      return Response.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const announcementIndex = announcements.findIndex(a => a.id === id)
    if (announcementIndex === -1) {
      return Response.json({ error: "Announcement not found" }, { status: 404 })
    }

    const announcement = announcements[announcementIndex]
    
    // Check if the user is the author of this announcement
    if (announcement.author.id !== authorId) {
      return Response.json({ error: "You can only delete your own announcements" }, { status: 403 })
    }

    // Remove the announcement
    announcements.splice(announcementIndex, 1)
    
    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting announcement:", error)
    return Response.json({ error: "Failed to delete announcement" }, { status: 500 })
  }
}