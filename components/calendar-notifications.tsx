"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/auth-client"
import { useToast } from "@/hooks/use-toast"
import { Bell, Calendar, Clock, AlertTriangle } from "lucide-react"

interface CalendarTask {
  id: string
  title: string
  date: string
  time: string
  type: "assignment" | "reminder" | "event" | "meeting"
  priority: "high" | "medium" | "low"
  reminderSettings: {
    enabled: boolean
    remindBefore: number
    reminderSent: boolean
  }
  createdBy: {
    id: string
    name: string
    role: string
  }
}

interface CalendarNotification {
  id: string
  taskId: string
  title: string
  message: string
  type: "upcoming" | "overdue" | "reminder"
  priority: string
  scheduledTime: string
  shown: boolean
}

export function CalendarNotifications() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [tasks, setTasks] = useState<CalendarTask[]>([])
  const [notifications, setNotifications] = useState<CalendarNotification[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      loadTasks()
      // Check for notifications every 5 minutes
      const interval = setInterval(checkForNotifications, 300000)
      // Also check immediately
      setTimeout(checkForNotifications, 1000)
      return () => clearInterval(interval)
    }
  }, [currentUser])

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error("Error loading current user:", error)
    }
  }

  const loadTasks = async () => {
    if (!currentUser) return

    try {
      const today = new Date()
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

      // Load tasks for the next week
      const response = await fetch(
        `/api/calendar?userId=${currentUser.id}&startDate=${today.toISOString().split("T")[0]}&endDate=${nextWeek.toISOString().split("T")[0]}`,
      )
      const data = await response.json()

      if (response.ok) {
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error("Error loading tasks:", error)
    }
  }

  const checkForNotifications = () => {
    if (!tasks.length) return

    const now = new Date()
    const newNotifications: CalendarNotification[] = []

    tasks.forEach((task) => {
      // Parse task date and time
      const taskDateTime = new Date(`${task.date}T${convertTo24Hour(task.time)}`)

      // Check for overdue tasks
      if (taskDateTime < now && !task.isCompleted) {
        const existingNotification = notifications.find((n) => n.taskId === task.id && n.type === "overdue")
        if (!existingNotification || !existingNotification.shown) {
          newNotifications.push({
            id: `overdue-${task.id}-${Date.now()}`,
            taskId: task.id,
            title: `Overdue: ${task.title}`,
            message: `This ${task.type} was due ${formatTimeAgo(taskDateTime)}`,
            type: "overdue",
            priority: "high", // Overdue tasks are always high priority
            scheduledTime: taskDateTime.toISOString(),
            shown: false,
          })
        }
      }

      // Check for upcoming tasks (24 hours before)
      const upcomingTime = new Date(taskDateTime.getTime() - 24 * 60 * 60 * 1000)
      if (now >= upcomingTime && now < taskDateTime && !task.isCompleted) {
        const existingNotification = notifications.find((n) => n.taskId === task.id && n.type === "upcoming")
        if (!existingNotification || !existingNotification.shown) {
          const hoursUntil = Math.ceil((taskDateTime.getTime() - now.getTime()) / (1000 * 60 * 60))
          newNotifications.push({
            id: `upcoming-${task.id}-${Date.now()}`,
            taskId: task.id,
            title: `Upcoming: ${task.title}`,
            message: `${task.type.charAt(0).toUpperCase() + task.type.slice(1)} due in ${hoursUntil} hour${hoursUntil !== 1 ? "s" : ""}`,
            type: "upcoming",
            priority: task.priority,
            scheduledTime: taskDateTime.toISOString(),
            shown: false,
          })
        }
      }

      // Check for reminder notifications (based on task reminder settings)
      if (task.reminderSettings.enabled && !task.reminderSettings.reminderSent) {
        const reminderTime = new Date(taskDateTime.getTime() - task.reminderSettings.remindBefore * 60000)
        if (now >= reminderTime && now <= taskDateTime) {
          const existingNotification = notifications.find((n) => n.taskId === task.id && n.type === "reminder")
          if (!existingNotification || !existingNotification.shown) {
            newNotifications.push({
              id: `reminder-${task.id}-${Date.now()}`,
              taskId: task.id,
              title: task.title,
              message: `${task.type.charAt(0).toUpperCase() + task.type.slice(1)} due in ${task.reminderSettings.remindBefore} minutes`,
              type: "reminder",
              priority: task.priority,
              scheduledTime: taskDateTime.toISOString(),
              shown: false,
            })
          }
        }
      }
    })

    if (newNotifications.length > 0) {
      setNotifications((prev) => [...prev, ...newNotifications])

      // Show toast notifications
      newNotifications.forEach((notification) => {
        showToastNotification(notification)

        // Mark reminder as sent in the backend if it's a reminder type
        if (notification.type === "reminder") {
          markReminderAsSent(notification.taskId)
        }
      })
    }
  }

  const showToastNotification = (notification: CalendarNotification) => {
    const getIcon = () => {
      switch (notification.type) {
        case "overdue":
          return <AlertTriangle className="h-4 w-4" />
        case "upcoming":
          return <Calendar className="h-4 w-4" />
        case "reminder":
          return <Bell className="h-4 w-4" />
        default:
          return <Clock className="h-4 w-4" />
      }
    }

    const getVariant = () => {
      switch (notification.type) {
        case "overdue":
          return "destructive" as const
        default:
          return "default" as const
      }
    }

    toast({
      title: (
        <div className="flex items-center gap-2">
          {getIcon()}
          {notification.title}
        </div>
      ),
      description: notification.message,
      variant: getVariant(),
      duration: notification.type === "overdue" ? 10000 : 5000, // Overdue notifications stay longer
    })

    // Mark notification as shown
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, shown: true } : n)))
  }

  const markReminderAsSent = async (taskId: string) => {
    try {
      await fetch("/api/calendar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: taskId,
          userId: currentUser?.id,
          reminderSettings: {
            reminderSent: true,
          },
        }),
      })
    } catch (error) {
      console.error("Error marking reminder as sent:", error)
    }
  }

  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(" ")
    let [hours, minutes] = time.split(":")
    if (hours === "12") {
      hours = "00"
    }
    if (modifier === "PM") {
      hours = (Number.parseInt(hours, 10) + 12).toString()
    }
    return `${hours.padStart(2, "0")}:${minutes}:00`
  }

  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} day${days !== 1 ? "s" : ""} ago`
    }
  }

  // This component doesn't render anything visible - it just manages notifications
  return null
}
