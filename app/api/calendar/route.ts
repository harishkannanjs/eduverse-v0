import { NextRequest } from "next/server"

// Mock calendar tasks data
let calendarTasks: any[] = [
  {
    id: "1",
    title: "Math Quiz - Quadratic Equations",
    description: "Review chapters 4-6 before the quiz",
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: "10:00 AM",
    type: "assignment", // assignment, reminder, event, meeting
    priority: "high",
    createdBy: { id: "teacher_1", name: "Mrs. Wilson", role: "teacher" },
    assignedTo: ["student_1", "student_2"], // Empty array means it's for the creator only
    isCompleted: false,
    reminderSettings: {
      enabled: true,
      remindBefore: 60, // minutes before
      reminderSent: false
    },
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: "2", 
    title: "Study Chemistry with Emma",
    description: "Group study session for upcoming chemistry test",
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
    time: "3:00 PM",
    type: "event",
    priority: "medium",
    createdBy: { id: "student_1", name: "Alex Johnson", role: "student" },
    assignedTo: ["student_2"],
    isCompleted: false,
    reminderSettings: {
      enabled: true,
      remindBefore: 120, // 2 hours before
      reminderSent: false
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "3",
    title: "Parent-Teacher Conference",
    description: "Discussion about Alex's progress in mathematics",
    date: new Date(Date.now() + 259200000).toISOString().split('T')[0], // 3 days from now
    time: "2:30 PM",
    type: "meeting",
    priority: "high",
    createdBy: { id: "parent_1", name: "Michael Brown", role: "parent" },
    assignedTo: ["teacher_1"],
    isCompleted: false,
    reminderSettings: {
      enabled: true,
      remindBefore: 1440, // 24 hours before
      reminderSent: false
    },
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
  },
  {
    id: "4",
    title: "Complete History Research Paper",
    description: "Write a 5-page paper on World War II",
    date: new Date(Date.now() + 604800000).toISOString().split('T')[0], // 1 week from now
    time: "11:59 PM",
    type: "assignment",
    priority: "high",
    createdBy: { id: "student_1", name: "Alex Johnson", role: "student" },
    assignedTo: [], // Personal task
    isCompleted: false,
    reminderSettings: {
      enabled: true,
      remindBefore: 2880, // 48 hours before
      reminderSent: false
    },
    createdAt: new Date().toISOString(),
  }
]

// Helper function to check if user can access a task
function canUserAccessTask(userId: string, task: any): boolean {
  // User can see tasks they created or tasks assigned to them
  return task.createdBy.id === userId || 
         task.assignedTo.includes(userId) ||
         (task.assignedTo.length === 0 && task.createdBy.id === userId)
}

// Get calendar tasks for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const date = searchParams.get('date') // YYYY-MM-DD format
    const month = searchParams.get('month') // YYYY-MM format
    const taskId = searchParams.get('taskId')
    
    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 })
    }

    if (taskId) {
      // Get specific task
      const task = calendarTasks.find(t => t.id === taskId)
      if (!task) {
        return Response.json({ error: "Task not found" }, { status: 404 })
      }
      
      if (!canUserAccessTask(userId, task)) {
        return Response.json({ error: "Access denied" }, { status: 403 })
      }
      
      return Response.json({ task })
    }

    // Filter tasks user can access
    let filteredTasks = calendarTasks.filter(task => canUserAccessTask(userId, task))

    // Filter by date if provided
    if (date) {
      filteredTasks = filteredTasks.filter(task => task.date === date)
    } else if (month) {
      filteredTasks = filteredTasks.filter(task => task.date.startsWith(month))
    }

    // Sort by date and time
    filteredTasks.sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
      if (dateCompare !== 0) return dateCompare
      
      // If same date, sort by time
      const timeA = convertTimeToMinutes(a.time)
      const timeB = convertTimeToMinutes(b.time)
      return timeA - timeB
    })

    return Response.json({ tasks: filteredTasks })
  } catch (error) {
    console.error("Error fetching calendar tasks:", error)
    return Response.json({ error: "Failed to fetch calendar tasks" }, { status: 500 })
  }
}

// Create a new calendar task
export async function POST(request: NextRequest) {
  try {
    const { 
      title, 
      description, 
      date, 
      time, 
      type = "reminder", 
      priority = "medium", 
      createdBy, 
      assignedTo = [],
      reminderSettings = { enabled: false }
    } = await request.json()
    
    if (!title || !date || !createdBy || !createdBy.id) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Response.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 })
    }

    // Validate type
    const validTypes = ["assignment", "reminder", "event", "meeting"]
    if (!validTypes.includes(type)) {
      return Response.json({ error: "Invalid task type" }, { status: 400 })
    }

    // Validate priority
    const validPriorities = ["high", "medium", "low"]
    if (!validPriorities.includes(priority)) {
      return Response.json({ error: "Invalid priority" }, { status: 400 })
    }

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description ? description.trim() : "",
      date,
      time: time || "12:00 PM",
      type,
      priority,
      createdBy,
      assignedTo: Array.isArray(assignedTo) ? assignedTo : [],
      isCompleted: false,
      reminderSettings: {
        enabled: reminderSettings.enabled || false,
        remindBefore: reminderSettings.remindBefore || 60,
        reminderSent: false
      },
      createdAt: new Date().toISOString(),
    }
    
    calendarTasks.push(newTask)
    
    return Response.json({ 
      task: newTask,
      success: true 
    })
  } catch (error) {
    console.error("Error creating calendar task:", error)
    return Response.json({ error: "Failed to create calendar task" }, { status: 500 })
  }
}

// Update a calendar task
export async function PUT(request: NextRequest) {
  try {
    const { 
      id, 
      title, 
      description, 
      date, 
      time, 
      type, 
      priority, 
      isCompleted, 
      reminderSettings, 
      userId 
    } = await request.json()
    
    if (!id || !userId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const task = calendarTasks.find(t => t.id === id)
    if (!task) {
      return Response.json({ error: "Task not found" }, { status: 404 })
    }

    // Check if user can modify this task (creator or assigned user for completion status only)
    if (task.createdBy.id !== userId && !task.assignedTo.includes(userId)) {
      return Response.json({ error: "Access denied" }, { status: 403 })
    }

    // If user is not the creator, they can only update completion status
    if (task.createdBy.id !== userId) {
      if (typeof isCompleted === 'boolean') {
        task.isCompleted = isCompleted
      }
      return Response.json({ task, success: true })
    }

    // Update task fields (creator can update everything)
    if (title) task.title = title.trim()
    if (description !== undefined) task.description = description.trim()
    if (date) task.date = date
    if (time) task.time = time
    if (type) task.type = type
    if (priority) task.priority = priority
    if (typeof isCompleted === 'boolean') task.isCompleted = isCompleted
    if (reminderSettings) {
      task.reminderSettings = {
        ...task.reminderSettings,
        ...reminderSettings
      }
    }
    
    return Response.json({ 
      task,
      success: true 
    })
  } catch (error) {
    console.error("Error updating calendar task:", error)
    return Response.json({ error: "Failed to update calendar task" }, { status: 500 })
  }
}

// Delete a calendar task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')
    const userId = searchParams.get('userId')
    
    if (!taskId || !userId) {
      return Response.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const taskIndex = calendarTasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) {
      return Response.json({ error: "Task not found" }, { status: 404 })
    }

    const task = calendarTasks[taskIndex]
    
    // Only the creator can delete a task
    if (task.createdBy.id !== userId) {
      return Response.json({ error: "Only the creator can delete this task" }, { status: 403 })
    }

    // Remove the task
    calendarTasks.splice(taskIndex, 1)
    
    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting calendar task:", error)
    return Response.json({ error: "Failed to delete calendar task" }, { status: 500 })
  }
}

// Helper function to convert time string to minutes for sorting
function convertTimeToMinutes(timeString: string): number {
  if (!timeString) return 0
  
  const [time, period] = timeString.split(' ')
  const [hours, minutes] = time.split(':').map(Number)
  
  let totalMinutes = (hours % 12) * 60 + (minutes || 0)
  if (period === 'PM') totalMinutes += 12 * 60
  
  return totalMinutes
}