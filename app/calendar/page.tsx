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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  List,
  Eye,
  EyeOff,
  Filter,
  CalendarDays,
  TrendingUp,
  Target,
  Zap,
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
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800"
      case "meeting":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800"
      case "reminder":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800"
      case "event":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-300 dark:border-gray-800"
    }
  }

  const getPriorityColor = (priority: CalendarTask["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800"
      case "medium":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800"
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-300 dark:border-gray-800"
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

  const getTaskStatistics = () => {
    const today = new Date().toISOString().split("T")[0]
    const thisWeek = new Date()
    thisWeek.setDate(thisWeek.getDate() + 7)
    const thisWeekString = thisWeek.toISOString().split("T")[0]

    const todayTasks = monthTasks.filter((task) => task.date === today)
    const thisWeekTasks = monthTasks.filter((task) => task.date >= today && task.date <= thisWeekString)
    const completedTasks = monthTasks.filter((task) => task.isCompleted)
    const highPriorityTasks = monthTasks.filter((task) => task.priority === "high" && !task.isCompleted)

    return {
      today: todayTasks.length,
      thisWeek: thisWeekTasks.length,
      completed: completedTasks.length,
      highPriority: highPriorityTasks.length,
      completionRate: monthTasks.length > 0 ? Math.round((completedTasks.length / monthTasks.length) * 100) : 0,
    }
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
  const stats = getTaskStatistics()

  return (
    <DashboardLayout title="Calendar">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">My Calendar</h1>
              <p className="text-muted-foreground">
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "calendar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  className="transition-all duration-200"
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="transition-all duration-200"
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
              </div>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200">
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
                          onValueChange={(value: CalendarTask["priority"]) =>
                            setTaskForm({ ...taskForm, priority: value })
                          }
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
                        onChange={(e) =>
                          setTaskForm({ ...taskForm, remindBefore: Number.parseInt(e.target.value) || 60 })
                        }
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.today}</p>
                  <p className="text-sm text-muted-foreground">Today's Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CalendarDays className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.thisWeek}</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completionRate}%</p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <Zap className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.highPriority}</p>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Filters:</span>
              </div>

              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-2 focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
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
                  className="flex items-center gap-2 hover:bg-primary/10"
                >
                  {showCompleted ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  {showCompleted ? "Hide" : "Show"} Completed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "calendar" | "list")}>
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 shadow-lg border-2 hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      Schedule Overview
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border-2 border-muted"
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
                        borderRadius: "6px",
                      },
                      hasHighPriority: {
                        backgroundColor: "hsl(var(--destructive))",
                        color: "hsl(var(--destructive-foreground))",
                        fontWeight: "bold",
                        borderRadius: "6px",
                        boxShadow: "0 0 0 2px hsl(var(--destructive))",
                      },
                    }}
                  />
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10">
                      <div className="w-4 h-4 bg-primary rounded-full shadow-sm"></div>
                      <span className="text-primary font-medium">Days with tasks</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-destructive/10">
                      <div className="w-4 h-4 bg-destructive rounded-full shadow-sm"></div>
                      <span className="text-destructive font-medium">High priority tasks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 shadow-lg border-2 hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-secondary/5 to-accent/5 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-secondary" />
                      {selectedDate?.toDateString() || "Today"}
                      <Badge variant="secondary" className="ml-2 px-3 py-1">
                        {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
                      </Badge>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-96">
                    {filteredTasks.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                          <CalendarIcon className="h-12 w-12 text-primary/60" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">
                          {tasks.length === 0
                            ? "No tasks scheduled for this day"
                            : "No tasks match your current filters"}
                        </h3>
                        <p className="text-sm mb-4">
                          {tasks.length === 0
                            ? "Start organizing your day by adding your first task"
                            : "Try adjusting your filters to see more tasks"}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setTaskForm({ ...taskForm, date: selectedDateString })
                            setIsCreateDialogOpen(true)
                          }}
                          className="hover:bg-primary/10"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
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
                              className={`group p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                                task.isCompleted
                                  ? "opacity-60 bg-muted/30 border-muted hover:border-muted"
                                  : "bg-card border-border hover:border-primary/40 hover:bg-primary/5"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto hover:bg-transparent mt-1"
                                    onClick={() => toggleTaskCompletion(task.id, task.isCompleted)}
                                  >
                                    {task.isCompleted ? (
                                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                                    ) : (
                                      <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                                    )}
                                  </Button>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                                      <h3
                                        className={`font-semibold text-lg ${
                                          task.isCompleted ? "line-through text-muted-foreground" : ""
                                        }`}
                                      >
                                        {task.title}
                                      </h3>
                                      <Badge
                                        variant="outline"
                                        className={`${getTaskTypeColor(task.type)} text-xs font-medium px-2 py-1`}
                                      >
                                        {getTaskTypeIcon(task.type)}
                                        <span className="ml-1 capitalize">{task.type}</span>
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className={`${getPriorityColor(task.priority)} text-xs font-medium px-2 py-1`}
                                      >
                                        {task.priority === "high" && <AlertCircle className="h-3 w-3 mr-1" />}
                                        <span className="capitalize">{task.priority}</span>
                                      </Badge>
                                    </div>
                                    {task.description && (
                                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                                        {task.description}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-medium">{task.time}</span>
                                      </div>
                                      {task.reminderSettings.enabled && (
                                        <div className="flex items-center gap-2">
                                          <Bell className="h-4 w-4" />
                                          <span>{task.reminderSettings.remindBefore}m before</span>
                                        </div>
                                      )}
                                      <span>by {task.createdBy.name}</span>
                                    </div>
                                  </div>
                                </div>
                                {task.createdBy.id === currentUser.id && (
                                  <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="p-2 h-auto text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5 text-accent" />
                  All Tasks
                  <Badge variant="secondary" className="ml-2 px-3 py-1">
                    {filteredTasks.length} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ScrollArea className="h-[600px]">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center">
                        <List className="h-12 w-12 text-accent/60" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No tasks match your current filters</h3>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
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
                            className={`group p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                              task.isCompleted
                                ? "opacity-60 bg-muted/30 border-muted hover:border-muted"
                                : "bg-card border-border hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4 flex-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-0 h-auto hover:bg-transparent mt-1"
                                  onClick={() => toggleTaskCompletion(task.id, task.isCompleted)}
                                >
                                  {task.isCompleted ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                  ) : (
                                    <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                                  )}
                                </Button>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                                    <h3
                                      className={`font-semibold text-lg ${
                                        task.isCompleted ? "line-through text-muted-foreground" : ""
                                      }`}
                                    >
                                      {task.title}
                                    </h3>
                                    <Badge
                                      variant="outline"
                                      className={`${getTaskTypeColor(task.type)} text-xs font-medium px-2 py-1`}
                                    >
                                      {getTaskTypeIcon(task.type)}
                                      <span className="ml-1 capitalize">{task.type}</span>
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className={`${getPriorityColor(task.priority)} text-xs font-medium px-2 py-1`}
                                    >
                                      {task.priority === "high" && <AlertCircle className="h-3 w-3 mr-1" />}
                                      <span className="capitalize">{task.priority}</span>
                                    </Badge>
                                  </div>
                                  {task.description && (
                                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                      {task.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <CalendarIcon className="h-4 w-4" />
                                      <span className="font-medium">{new Date(task.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      <span className="font-medium">{task.time}</span>
                                    </div>
                                    {task.reminderSettings.enabled && (
                                      <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4" />
                                        <span>{task.reminderSettings.remindBefore}m before</span>
                                      </div>
                                    )}
                                    <span>by {task.createdBy.name}</span>
                                  </div>
                                </div>
                              </div>
                              {task.createdBy.id === currentUser.id && (
                                <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-2 h-auto text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
