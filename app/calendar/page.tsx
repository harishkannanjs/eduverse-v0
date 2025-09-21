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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { getCurrentUser, type User } from "@/lib/auth-client"
import {
  CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  AlertCircle,
  Users,
  BookOpen,
  Bell,
  Trash2,
  Search,
  Grid3X3,
  List,
  Eye,
  EyeOff,
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
  const [filteredTasks, setFilteredTasks] = useState<CalendarTask[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [showCompleted, setShowCompleted] = useState(true)

  // Form state for creating tasks
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "12:00 PM",
    type: "reminder" as CalendarTask["type"],
    priority: "medium" as CalendarTask["priority"],
    reminderEnabled: true,
    remindBefore: 60,
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

  useEffect(() => {
    applyFilters()
  }, [tasks, searchQuery, filterType, filterPriority, showCompleted])

  const loadUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error("Error loading user:", error)
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
      console.error("Error loading month tasks:", error)
    }
  }

  const loadDayTasks = async () => {
    if (!currentUser || !selectedDate) return

    try {
      const date = selectedDate.toISOString().split("T")[0] // YYYY-MM-DD
      const response = await fetch(`/api/calendar?userId=${currentUser.id}&date=${date}`)

      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error("Error loading day tasks:", error)
    }
  }

  const applyFilters = () => {
    let filtered = tasks

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((task) => task.type === filterType)
    }

    // Priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter((task) => task.priority === filterPriority)
    }

    // Completed filter
    if (!showCompleted) {
      filtered = filtered.filter((task) => !task.isCompleted)
    }

    setFilteredTasks(filtered)
  }

  const createTask = async () => {
    if (!currentUser || !taskForm.title || !taskForm.date) return

    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          remindBefore: 60,
        })
        await loadDayTasks()
        await loadMonthTasks()
      }
    } catch (error) {
      console.error("Error creating task:", error)
    }
  }

  const toggleTaskCompletion = async (taskId: string, isCompleted: boolean) => {
    if (!currentUser) return

    try {
      const response = await fetch("/api/calendar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
      console.error("Error updating task:", error)
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!currentUser) return

    try {
      const response = await fetch(`/api/calendar?taskId=${taskId}&userId=${currentUser.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadDayTasks()
        await loadMonthTasks()
      }
    } catch (error) {
      console.error("Error deleting task:", error)
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
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
      case "meeting":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
      case "reminder":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
      case "event":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
    }
  }

  const getPriorityColor = (priority: CalendarTask["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800"
      case "low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
    }
  }

  const getDaysWithTasks = () => {
    const daysWithTasks = new Map<string, CalendarTask[]>()
    monthTasks.forEach((task) => {
      const dateKey = task.date
      if (!daysWithTasks.has(dateKey)) {
        daysWithTasks.set(dateKey, [])
      }
      daysWithTasks.get(dateKey)!.push(task)
    })
    return daysWithTasks
  }

  const getTaskCountForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    const dayTasks = monthTasks.filter((task) => task.date === dateString)
    return dayTasks.length
  }

  const getHighPriorityTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    const dayTasks = monthTasks.filter((task) => task.date === dateString && task.priority === "high")
    return dayTasks.length
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
  const selectedDateString = selectedDate?.toISOString().split("T")[0] || ""

  return (
    <DashboardLayout title="Calendar">
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">My Calendar</h1>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new task, reminder, or event to your calendar.</DialogDescription>
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
                    rows={2}
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
                        const [hours, minutes] = e.target.value.split(":")
                        const period = Number.parseInt(hours) >= 12 ? "PM" : "AM"
                        const hour12 = Number.parseInt(hours) % 12 || 12
                        setTaskForm({ ...taskForm, time: `${hour12}:${minutes} ${period}` })
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={taskForm.type}
                      onValueChange={(value: CalendarTask["type"]) => setTaskForm({ ...taskForm, type: value })}
                    >
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
                    <Select
                      value={taskForm.priority}
                      onValueChange={(value: CalendarTask["priority"]) => setTaskForm({ ...taskForm, priority: value })}
                    >
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
                    onChange={(e) => setTaskForm({ ...taskForm, remindBefore: Number.parseInt(e.target.value) || 60 })}
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

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="flex items-center gap-2"
                >
                  {showCompleted ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  {showCompleted ? "Hide" : "Show"} Completed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "calendar" | "list")}>
          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enhanced Calendar */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Schedule Overview
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      hasTask: (date) => {
                        const dateString = date.toISOString().split("T")[0]
                        return monthTasks.some((task) => task.date === dateString)
                      },
                      hasHighPriority: (date) => {
                        const dateString = date.toISOString().split("T")[0]
                        return monthTasks.some((task) => task.date === dateString && task.priority === "high")
                      },
                    }}
                    modifiersStyles={{
                      hasTask: {
                        backgroundColor: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))",
                        fontWeight: "bold",
                      },
                      hasHighPriority: {
                        backgroundColor: "hsl(var(--destructive))",
                        color: "hsl(var(--destructive-foreground))",
                        fontWeight: "bold",
                      },
                    }}
                  />
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">Days with tasks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-destructive rounded-full"></div>
                      <span className="text-muted-foreground">High priority tasks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Task List for Selected Day */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      {selectedDate?.toDateString() || "Today"}
                      <Badge variant="secondary" className="ml-2">
                        {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
                      </Badge>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {filteredTasks.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="mb-2">
                          {tasks.length === 0
                            ? "No tasks scheduled for this day"
                            : "No tasks match your current filters"}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
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
                      <div className="space-y-3">
                        {filteredTasks
                          .sort((a, b) => {
                            // Sort by completion status, then priority, then time
                            if (a.isCompleted !== b.isCompleted) {
                              return a.isCompleted ? 1 : -1
                            }
                            const priorityOrder = { high: 3, medium: 2, low: 1 }
                            if (a.priority !== b.priority) {
                              return priorityOrder[b.priority] - priorityOrder[a.priority]
                            }
                            return a.time.localeCompare(b.time)
                          })
                          .map((task) => (
                            <div
                              key={task.id}
                              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                                task.isCompleted
                                  ? "opacity-60 bg-muted/20 border-muted"
                                  : "bg-card border-border hover:border-primary/30"
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
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                      <h3
                                        className={`font-medium ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}
                                      >
                                        {task.title}
                                      </h3>
                                      <Badge variant="outline" className={`${getTaskTypeColor(task.type)} text-xs`}>
                                        {getTaskTypeIcon(task.type)}
                                        <span className="ml-1 capitalize">{task.type}</span>
                                      </Badge>
                                      <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-xs`}>
                                        {task.priority === "high" && <AlertCircle className="h-3 w-3 mr-1" />}
                                        <span className="capitalize">{task.priority}</span>
                                      </Badge>
                                    </div>
                                    {task.description && (
                                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                        {task.description}
                                      </p>
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
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <List className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No tasks match your current filters</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTasks
                        .sort((a, b) => {
                          // Sort by date, then priority, then time
                          if (a.date !== b.date) {
                            return new Date(a.date).getTime() - new Date(b.date).getTime()
                          }
                          const priorityOrder = { high: 3, medium: 2, low: 1 }
                          if (a.priority !== b.priority) {
                            return priorityOrder[b.priority] - priorityOrder[a.priority]
                          }
                          return a.time.localeCompare(b.time)
                        })
                        .map((task) => (
                          <div
                            key={task.id}
                            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                              task.isCompleted
                                ? "opacity-60 bg-muted/20 border-muted"
                                : "bg-card border-border hover:border-primary/30"
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
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <h3
                                      className={`font-medium ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}
                                    >
                                      {task.title}
                                    </h3>
                                    <Badge variant="outline" className={`${getTaskTypeColor(task.type)} text-xs`}>
                                      {getTaskTypeIcon(task.type)}
                                      <span className="ml-1 capitalize">{task.type}</span>
                                    </Badge>
                                    <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-xs`}>
                                      {task.priority === "high" && <AlertCircle className="h-3 w-3 mr-1" />}
                                      <span className="capitalize">{task.priority}</span>
                                    </Badge>
                                  </div>
                                  {task.description && (
                                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                                  )}
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <CalendarIcon className="h-3 w-3" />
                                      {new Date(task.date).toLocaleDateString()}
                                    </div>
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
