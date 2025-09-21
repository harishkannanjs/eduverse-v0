"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/auth-client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Bell, X, Clock } from "lucide-react"

interface Task {
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

interface ReminderNotification {
  id: string
  taskId: string
  title: string
  message: string
  priority: string
  scheduledTime: string
  dismissed: boolean
}

export function TaskReminder() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [reminders, setReminders] = useState<ReminderNotification[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    loadCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      loadTasks()
      const interval = setInterval(checkForReminders, 60000) // Check every minute
      return () => clearInterval(interval)
    }
  }, [currentUser])

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error('Error loading current user:', error)
    }
  }

  const loadTasks = async () => {
    if (!currentUser) return

    try {
      const today = new Date()
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      // Load tasks for the next week
      const response = await fetch(`/api/calendar?userId=${currentUser.id}&startDate=${today.toISOString().split('T')[0]}&endDate=${nextWeek.toISOString().split('T')[0]}`)
      const data = await response.json()
      
      if (response.ok) {
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
    }
  }

  const checkForReminders = () => {
    if (!tasks.length) return

    const now = new Date()
    const newReminders: ReminderNotification[] = []

    tasks.forEach(task => {
      if (!task.reminderSettings.enabled || task.reminderSettings.reminderSent) return

      // Parse task date and time
      const taskDateTime = new Date(`${task.date}T${convertTo24Hour(task.time)}`)
      const reminderTime = new Date(taskDateTime.getTime() - task.reminderSettings.remindBefore * 60000)

      // Check if reminder time has passed and it's not in the past
      if (now >= reminderTime && now <= taskDateTime) {
        const existingReminder = reminders.find(r => r.taskId === task.id)
        if (!existingReminder) {
          newReminders.push({
            id: `reminder-${task.id}-${Date.now()}`,
            taskId: task.id,
            title: task.title,
            message: `${task.type.charAt(0).toUpperCase() + task.type.slice(1)} due in ${task.reminderSettings.remindBefore} minutes`,
            priority: task.priority,
            scheduledTime: taskDateTime.toISOString(),
            dismissed: false
          })
        }
      }
    })

    if (newReminders.length > 0) {
      setReminders(prev => [...prev.filter(r => !r.dismissed), ...newReminders])
      
      // Mark reminders as sent in the backend
      newReminders.forEach(reminder => markReminderAsSent(reminder.taskId))
    }
  }

  const markReminderAsSent = async (taskId: string) => {
    try {
      await fetch('/api/calendar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: taskId,
          userId: currentUser?.id,
          reminderSettings: {
            reminderSent: true
          }
        }),
      })
    } catch (error) {
      console.error('Error marking reminder as sent:', error)
    }
  }

  const dismissReminder = (reminderId: string) => {
    setReminders(prev => 
      prev.map(r => r.id === reminderId ? { ...r, dismissed: true } : r)
    )
  }

  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')
    if (hours === '12') {
      hours = '00'
    }
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString()
    }
    return `${hours.padStart(2, '0')}:${minutes}:00`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "low":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const activeReminders = reminders.filter(r => !r.dismissed)

  if (activeReminders.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {activeReminders.map((reminder) => (
        <Alert key={reminder.id} className={`w-80 ${getPriorityColor(reminder.priority)} shadow-lg`}>
          <Bell className="h-4 w-4" />
          <AlertDescription className="pr-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">{reminder.title}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {reminder.message}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-transparent"
                onClick={() => dismissReminder(reminder.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
