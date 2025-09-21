"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getCurrentUser, User } from "@/lib/auth"
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  AlertCircle,
  Users,
  BookOpen,
  Bell,
  Trash2,
  Edit3
} from "lucide-react"

interface CalendarTask {
  id: string
  title: string
  description?: string
  date: string
  time: string
  type: "assignment" | "reminder" | "event" | "meeting"
  priority: "high" | "medium" | "low"
  createdBy: { id: string; name: string; role: string }
  assignedTo: string[]
  isCompleted: boolean
  reminderSettings: {
    enabled: boolean
    remindBefore: number
    reminderSent: boolean
  }
  createdAt: string
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<CalendarTask[]>([])
  const [monthTasks, setMonthTasks] = useState<CalendarTask[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  // Form state for creating tasks
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "12:00 PM",
    type: "reminder" as CalendarTask["type"],
    priority: "medium" as CalendarTask["priority"],
    reminderEnabled: true,
    remindBefore: 60
  })

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      loadMonthTasks()
    }
  }, [currentUser, selectedDate])

  useEffect(() => {
    if (currentUser && selectedDate) {
      loadDayTasks()
    }
  }, [currentUser, selectedDate])

  const loadUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMonthTasks = async () => {
    if (!currentUser || !selectedDate) return

    try {
      const month = selectedDate.toISOString().slice(0, 7) // YYYY-MM
      const response = await fetch(`/api/calendar?userId=${currentUser.id}&month=${month}`)
      
      if (response.ok) {
        const data = await response.json()
        setMonthTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Error loading month tasks:', error)
    }
  }

  const loadDayTasks = async () => {
    if (!currentUser || !selectedDate) return

    try {
      const date = selectedDate.toISOString().split('T')[0] // YYYY-MM-DD
      const response = await fetch(`/api/calendar?userId=${currentUser.id}&date=${date}`)
      
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Error loading day tasks:', error)
    }
  }

  const createTask = async () => {
    if (!currentUser || !taskForm.title || !taskForm.date) return

    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskForm.title,
          description: taskForm.description,
          date: taskForm.date,
          time: taskForm.time,
          type: taskForm.type,
          priority: taskForm.priority,
          createdBy: {
            id: currentUser.id,
            name: currentUser.name,
            role: currentUser.role,
          },
          reminderSettings: {
            enabled: taskForm.reminderEnabled,
            remindBefore: taskForm.remindBefore,
          },
        }),
      })

      if (response.ok) {
        setIsCreateDialogOpen(false)
        setTaskForm({
          title: "",
          description: "",
          date: "",
          time: "12:00 PM",
          type: "reminder",
          priority: "medium",
          reminderEnabled: true,
          remindBefore: 60
        })
        await loadDayTasks()
        await loadMonthTasks()
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const toggleTaskCompletion = async (taskId: string, isCompleted: boolean) => {
    if (!currentUser) return

    try {
      const response = await fetch('/api/calendar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: taskId,
          isCompleted: !isCompleted,
          userId: currentUser.id,
        }),
      })

      if (response.ok) {
        await loadDayTasks()
        await loadMonthTasks()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!currentUser) return

    try {
      const response = await fetch(`/api/calendar?taskId=${taskId}&userId=${currentUser.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadDayTasks()
        await loadMonthTasks()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const getTaskTypeIcon = (type: CalendarTask["type"]) => {
    switch (type) {
      case "assignment":
        return <BookOpen className="h-4 w-4" />
      case "meeting":
        return <Users className="h-4 w-4" />
      case "reminder":
        return <Bell className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getTaskTypeColor = (type: CalendarTask["type"]) => {
    switch (type) {
      case "assignment":
        return "bg-blue-500/10 text-blue-700 border-blue-200"
      case "meeting":
        return "bg-green-500/10 text-green-700 border-green-200"
      case "reminder":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200"
    }
  }

  const getPriorityColor = (priority: CalendarTask["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-500/10 text-green-700 border-green-200"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200"
    }
  }

  const getDaysWithTasks = () => {
    const daysWithTasks = new Set<string>()
    monthTasks.forEach(task => {
      daysWithTasks.add(task.date)
    })
    return daysWithTasks
  }

  if (loading) {
    return (
      <DashboardLayout title="Calendar">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!currentUser) {
    return (
      <DashboardLayout title="Calendar">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Unable to load user information. Please refresh the page.</p>
        </div>
      </DashboardLayout>
    )
  }

  const daysWithTasks = getDaysWithTasks()
  const selectedDateString = selectedDate?.toISOString().split('T')[0] || ""

  return (
    <DashboardLayout title="Calendar">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Schedule</CardTitle>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Add a new task, reminder, or event to your calendar.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={taskForm.description}
                        onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                        placeholder="Add details about this task"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={taskForm.date}
                          onChange={(e) => setTaskForm({ ...taskForm, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={taskForm.time.slice(0, 5)}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':')
                            const period = parseInt(hours) >= 12 ? 'PM' : 'AM'
                            const hour12 = parseInt(hours) % 12 || 12
                            setTaskForm({ ...taskForm, time: `${hour12}:${minutes} ${period}` })
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={taskForm.type} onValueChange={(value: CalendarTask["type"]) => setTaskForm({ ...taskForm, type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reminder">Reminder</SelectItem>
                            <SelectItem value="assignment">Assignment</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={taskForm.priority} onValueChange={(value: CalendarTask["priority"]) => setTaskForm({ ...taskForm, priority: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminder">Reminder (minutes before)</Label>
                      <Input
                        id="reminder"
                        type="number"
                        value={taskForm.remindBefore}
                        onChange={(e) => setTaskForm({ ...taskForm, remindBefore: parseInt(e.target.value) || 60 })}
                        placeholder="60"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createTask} disabled={!taskForm.title || !taskForm.date}>
                      Create Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasTask: (date) => daysWithTasks.has(date.toISOString().split('T')[0])
              }}
              modifiersStyles={{
                hasTask: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: 'bold'
                }
              }}
            />
            <div className="mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Days with tasks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task List for Selected Day */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Tasks for {selectedDate?.toDateString() || "Today"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks scheduled for this day</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setTaskForm({ ...taskForm, date: selectedDateString })
                      setIsCreateDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        task.isCompleted ? 'opacity-60 bg-muted/20' : 'bg-card hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto hover:bg-transparent"
                            onClick={() => toggleTaskCompletion(task.id, task.isCompleted)}
                          >
                            {task.isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                            )}
                          </Button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className={`font-medium ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                                {task.title}
                              </h3>
                              <Badge variant="outline" className={getTaskTypeColor(task.type)}>
                                {getTaskTypeIcon(task.type)}
                                <span className="ml-1">{task.type}</span>
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority === "high" && <AlertCircle className="h-3 w-3 mr-1" />}
                                {task.priority}
                              </Badge>
                            </div>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {task.time}
                              </div>
                              {task.reminderSettings.enabled && (
                                <div className="flex items-center gap-1">
                                  <Bell className="h-3 w-3" />
                                  {task.reminderSettings.remindBefore}m before
                                </div>
                              )}
                              <span>by {task.createdBy.name}</span>
                            </div>
                          </div>
                        </div>
                        {task.createdBy.id === currentUser.id && (
                          <div className="flex items-center gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-auto text-muted-foreground hover:text-destructive"
                              onClick={() => deleteTask(task.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}