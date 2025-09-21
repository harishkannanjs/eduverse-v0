"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TrendingUp,
  Brain,
  Bell,
  MessageSquare,
  Calendar,
  BookOpen,
  Trophy,
  Clock,
  Target,
  BarChart3,
  Heart,
  User,
  Send,
  Phone,
  Video,
  Mail,
  Download,
  Settings,
  Plus,
  Search,
  Filter,
  MessageCircle,
  CalendarDays,
  Paperclip,
} from "lucide-react"

interface TeacherMessage {
  id: string
  teacherName: string
  teacherInitials: string
  subject: string
  message: string
  timestamp: Date
  priority: "high" | "medium" | "low"
  isRead: boolean
  hasAttachment?: boolean
}

interface ConferenceRequest {
  id: string
  teacherName: string
  subject: string
  preferredDates: string[]
  reason: string
  urgency: "high" | "medium" | "low"
  status: "pending" | "scheduled" | "completed"
}

export default function ParentDashboard() {
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [isConferenceDialogOpen, setIsConferenceDialogOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [messageFilter, setMessageFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for enhanced communication features
  const [messages, setMessages] = useState<TeacherMessage[]>([
    {
      id: "1",
      teacherName: "Mrs. Wilson",
      teacherInitials: "SW",
      subject: "Mathematics",
      message:
        "Alex did exceptionally well on today's quiz! His understanding of quadratic equations has really improved. I'd love to discuss his potential for advanced placement next year.",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      priority: "medium",
      isRead: false,
      hasAttachment: true,
    },
    {
      id: "2",
      teacherName: "Mr. Davis",
      teacherInitials: "JD",
      subject: "Chemistry",
      message:
        "Alex might benefit from some extra practice with balancing chemical equations. I've shared some resources and would like to schedule a brief meeting to discuss study strategies.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      priority: "high",
      isRead: true,
    },
    {
      id: "3",
      teacherName: "Ms. Martinez",
      teacherInitials: "LM",
      subject: "History",
      message:
        "Great job on the World War II project! Alex's research was thorough and well-presented. His analytical skills are developing nicely.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      priority: "low",
      isRead: true,
    },
    {
      id: "4",
      teacherName: "Dr. Thompson",
      teacherInitials: "ET",
      subject: "English Literature",
      message:
        "I wanted to reach out about Alex's recent essay on Shakespeare. While his analysis is insightful, I think we should work on his citation format. Could we set up a time to discuss?",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      priority: "medium",
      isRead: false,
    },
  ])

  const [conferenceRequests, setConferenceRequests] = useState<ConferenceRequest[]>([
    {
      id: "1",
      teacherName: "Mrs. Wilson",
      subject: "Mathematics",
      preferredDates: ["2024-01-15", "2024-01-16", "2024-01-17"],
      reason: "Discuss advanced placement opportunities",
      urgency: "medium",
      status: "pending",
    },
    {
      id: "2",
      teacherName: "Mr. Davis",
      subject: "Chemistry",
      preferredDates: ["2024-01-18", "2024-01-19"],
      reason: "Review study strategies and additional support",
      urgency: "high",
      status: "scheduled",
    },
  ])

  const [newMessage, setNewMessage] = useState({
    teacher: "",
    subject: "",
    message: "",
    priority: "medium" as "high" | "medium" | "low",
  })

  const [newConferenceRequest, setNewConferenceRequest] = useState({
    teacher: "",
    reason: "",
    preferredDates: ["", "", ""],
    urgency: "medium" as "high" | "medium" | "low",
  })

  const teachers = [
    { name: "Mrs. Wilson", subject: "Mathematics" },
    { name: "Mr. Davis", subject: "Chemistry" },
    { name: "Ms. Martinez", subject: "History" },
    { name: "Dr. Thompson", subject: "English Literature" },
    { name: "Mr. Johnson", subject: "Physics" },
    { name: "Ms. Garcia", subject: "Spanish" },
  ]

  const filteredMessages = messages.filter((message) => {
    const matchesFilter =
      messageFilter === "all" ||
      (messageFilter === "unread" && !message.isRead) ||
      (messageFilter === "high" && message.priority === "high")

    const matchesSearch =
      searchQuery === "" ||
      message.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const sendMessage = () => {
    if (!newMessage.teacher || !newMessage.subject || !newMessage.message) return

    const message: TeacherMessage = {
      id: Date.now().toString(),
      teacherName: newMessage.teacher,
      teacherInitials: newMessage.teacher
        .split(" ")
        .map((n) => n[0])
        .join(""),
      subject: newMessage.subject,
      message: newMessage.message,
      timestamp: new Date(),
      priority: newMessage.priority,
      isRead: true, // Sent messages are considered read
    }

    setMessages([message, ...messages])
    setNewMessage({ teacher: "", subject: "", message: "", priority: "medium" })
    setIsMessageDialogOpen(false)
  }

  const requestConference = () => {
    if (!newConferenceRequest.teacher || !newConferenceRequest.reason) return

    const request: ConferenceRequest = {
      id: Date.now().toString(),
      teacherName: newConferenceRequest.teacher,
      subject: teachers.find((t) => t.name === newConferenceRequest.teacher)?.subject || "",
      preferredDates: newConferenceRequest.preferredDates.filter((date) => date !== ""),
      reason: newConferenceRequest.reason,
      urgency: newConferenceRequest.urgency,
      status: "pending",
    }

    setConferenceRequests([request, ...conferenceRequests])
    setNewConferenceRequest({ teacher: "", reason: "", preferredDates: ["", "", ""], urgency: "medium" })
    setIsConferenceDialogOpen(false)
  }

  const markAsRead = (messageId: string) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "scheduled":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "completed":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const unreadCount = messages.filter((msg) => !msg.isRead).length

  return (
    <DashboardLayout title="Parent Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-2">Welcome, Michael!</h2>
          <p className="text-muted-foreground">
            Alex is doing great this week! Check out the latest progress updates and upcoming events below.
          </p>
          {unreadCount > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <Bell className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-600 font-medium">
                You have {unreadCount} unread message{unreadCount !== 1 ? "s" : ""} from teachers
              </span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-sm text-muted-foreground">Overall Grade</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Assignments Done</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-1 rounded-lg">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-5 rounded-lg">
                  <Clock className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">24h</p>
                  <p className="text-sm text-muted-foreground">Study Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="communication" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="progress">Progress Overview</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="communication" className="space-y-6">
            {/* Enhanced Communication Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Messages Section */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      <CardTitle>Teacher Communications</CardTitle>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {unreadCount} new
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            New Message
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Send Message to Teacher</DialogTitle>
                            <DialogDescription>
                              Communicate directly with your child's teachers about academic progress or concerns.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Teacher</Label>
                              <Select
                                value={newMessage.teacher}
                                onValueChange={(value) => setNewMessage({ ...newMessage, teacher: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                  {teachers.map((teacher) => (
                                    <SelectItem key={teacher.name} value={teacher.name}>
                                      {teacher.name} - {teacher.subject}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Subject</Label>
                              <Input
                                placeholder="Message subject"
                                value={newMessage.subject}
                                onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Priority</Label>
                              <Select
                                value={newMessage.priority}
                                onValueChange={(value: any) => setNewMessage({ ...newMessage, priority: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low Priority</SelectItem>
                                  <SelectItem value="medium">Medium Priority</SelectItem>
                                  <SelectItem value="high">High Priority</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Message</Label>
                              <Textarea
                                placeholder="Type your message here..."
                                value={newMessage.message}
                                onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                                rows={4}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              onClick={sendMessage}
                              disabled={!newMessage.teacher || !newMessage.subject || !newMessage.message}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <CardDescription>Recent messages and communications with Alex's teachers</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Message Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search messages..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={messageFilter} onValueChange={setMessageFilter}>
                      <SelectTrigger className="w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Messages</SelectItem>
                        <SelectItem value="unread">Unread Only</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {filteredMessages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No messages match your current filters</p>
                        </div>
                      ) : (
                        filteredMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-4 border rounded-lg transition-all hover:shadow-md cursor-pointer ${
                              !message.isRead ? "bg-primary/5 border-primary/20" : "bg-card"
                            }`}
                            onClick={() => markAsRead(message.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-primary">{message.teacherInitials}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm">{message.teacherName}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {message.subject}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${getPriorityColor(message.priority)}`}
                                    >
                                      {message.priority}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {!message.isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                                    <span className="text-xs text-muted-foreground">
                                      {message.timestamp.toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{message.message}</p>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline">
                                    <MessageCircle className="h-3 w-3 mr-1" />
                                    Reply
                                  </Button>
                                  {message.hasAttachment && (
                                    <Button size="sm" variant="outline">
                                      <Paperclip className="h-3 w-3 mr-1" />
                                      Attachment
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Quick Actions & Conference Requests */}
              <div className="space-y-6">
                {/* Conference Requests */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5" />
                        Conferences
                      </CardTitle>
                      <Dialog open={isConferenceDialogOpen} onOpenChange={setIsConferenceDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Request
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Request Parent Conference</DialogTitle>
                            <DialogDescription>
                              Schedule a meeting with your child's teacher to discuss their progress.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Teacher</Label>
                              <Select
                                value={newConferenceRequest.teacher}
                                onValueChange={(value) =>
                                  setNewConferenceRequest({ ...newConferenceRequest, teacher: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                  {teachers.map((teacher) => (
                                    <SelectItem key={teacher.name} value={teacher.name}>
                                      {teacher.name} - {teacher.subject}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Reason for Meeting</Label>
                              <Textarea
                                placeholder="What would you like to discuss?"
                                value={newConferenceRequest.reason}
                                onChange={(e) =>
                                  setNewConferenceRequest({ ...newConferenceRequest, reason: e.target.value })
                                }
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Preferred Dates</Label>
                              {newConferenceRequest.preferredDates.map((date, index) => (
                                <Input
                                  key={index}
                                  type="date"
                                  value={date}
                                  onChange={(e) => {
                                    const newDates = [...newConferenceRequest.preferredDates]
                                    newDates[index] = e.target.value
                                    setNewConferenceRequest({ ...newConferenceRequest, preferredDates: newDates })
                                  }}
                                />
                              ))}
                            </div>
                            <div className="space-y-2">
                              <Label>Urgency</Label>
                              <Select
                                value={newConferenceRequest.urgency}
                                onValueChange={(value: any) =>
                                  setNewConferenceRequest({ ...newConferenceRequest, urgency: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low - Within 2 weeks</SelectItem>
                                  <SelectItem value="medium">Medium - Within 1 week</SelectItem>
                                  <SelectItem value="high">High - ASAP</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsConferenceDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              onClick={requestConference}
                              disabled={!newConferenceRequest.teacher || !newConferenceRequest.reason}
                            >
                              <CalendarDays className="h-4 w-4 mr-2" />
                              Request Conference
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <CardDescription>Scheduled and requested meetings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {conferenceRequests.map((request) => (
                        <div key={request.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{request.teacherName}</h4>
                            <Badge className={`text-xs ${getStatusColor(request.status)}`}>{request.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{request.reason}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {request.subject}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(request.urgency)}`}>
                              {request.urgency}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Communication Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Common communication tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Phone className="h-4 w-4 mr-2" />
                      Call School Office
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Video className="h-4 w-4 mr-2" />
                      Join Virtual Meeting
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Mail className="h-4 w-4 mr-2" />
                      Email All Teachers
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download Reports
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      Communication Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {/* ... existing code ... */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Academic Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Academic Progress
                  </CardTitle>
                  <CardDescription>Alex's performance across all subjects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          Mathematics
                        </span>
                        <span className="font-medium">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Algebra II</span>
                        <span className="text-green-600">↑ 8% this month</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-secondary rounded-full"></div>
                          History
                        </span>
                        <span className="font-medium">88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>World History</span>
                        <span className="text-green-600">↑ 5% this month</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                          Chemistry
                        </span>
                        <span className="font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>General Chemistry</span>
                        <span className="text-yellow-600">→ Stable</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
                          English
                        </span>
                        <span className="font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Literature & Composition</span>
                        <span className="text-green-600">↑ 3% this month</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    View Detailed Report
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Recent Achievements
                  </CardTitle>
                  <CardDescription>Alex's latest accomplishments and milestones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <Trophy className="h-4 w-4 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Perfect Score on Algebra Quiz</h4>
                        <p className="text-xs text-muted-foreground">Scored 100% on quadratic equations quiz</p>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Completed History Project</h4>
                        <p className="text-xs text-muted-foreground">Excellent research on World War II</p>
                        <span className="text-xs text-muted-foreground">1 week ago</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-chart-1 border border-primary/20 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">7-Day Wellness Streak</h4>
                        <p className="text-xs text-muted-foreground">Consistent use of mindfulness tools</p>
                        <span className="text-xs text-muted-foreground">Ongoing</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-chart-5 border border-secondary/20 rounded-lg">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <Target className="h-4 w-4 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Study Goal Achieved</h4>
                        <p className="text-xs text-muted-foreground">Completed 20 hours of study this week</p>
                        <span className="text-xs text-muted-foreground">3 days ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events & Deadlines
                </CardTitle>
                <CardDescription>Important dates and assignments to keep track of</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      <span className="text-sm font-medium">Tomorrow</span>
                    </div>
                    <h4 className="font-medium">Algebra Quiz #3</h4>
                    <p className="text-sm text-muted-foreground">Mathematics • 15 questions</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span className="text-sm font-medium">Friday</span>
                    </div>
                    <h4 className="font-medium">History Mid-term</h4>
                    <p className="text-sm text-muted-foreground">World History • 25 questions</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium">Next Week</span>
                    </div>
                    <h4 className="font-medium">Parent Conference</h4>
                    <p className="text-sm text-muted-foreground">Virtual meeting with teachers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* ... existing code ... */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Learning Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Learning Insights
                  </CardTitle>
                  <CardDescription>Personalized recommendations based on Alex's learning patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-primary/10 rounded">
                          <Brain className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Strong Mathematical Reasoning</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Alex shows excellent problem-solving skills in algebra. Consider advanced math courses for
                            next semester.
                          </p>
                          <Badge variant="secondary" className="mt-2">
                            Strength Identified
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-secondary/10 rounded">
                          <TrendingUp className="h-4 w-4 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Improved Study Habits</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Alex's consistent study schedule has led to a 15% improvement in overall grades this month.
                          </p>
                          <Badge variant="outline" className="mt-2">
                            Positive Trend
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-chart-5 border border-secondary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-secondary/10 rounded">
                          <BookOpen className="h-4 w-4 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Chemistry Support Needed</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Consider additional practice with chemical equations. Visual learning resources might help.
                          </p>
                          <Badge variant="outline" className="mt-2">
                            Recommendation
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Recommended Study Methods</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Use diagrams and visual aids for complex concepts</li>
                      <li>• Incorporate hands-on experiments in science</li>
                      <li>• Create mind maps for history and literature</li>
                      <li>• Use color-coding for note organization</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Style Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Learning Style Analysis
                  </CardTitle>
                  <CardDescription>How Alex learns best based on AI analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Visual Learning</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Kinesthetic Learning</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Auditory Learning</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Reading/Writing</span>
                        <span className="font-medium">70%</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            {/* Alerts and Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Alerts
                  </CardTitle>
                  <CardDescription>Important notifications about Alex's education</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Bell className="h-4 w-4 text-destructive mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Assignment Due Tomorrow</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Chemistry lab report needs to be submitted by 11:59 PM tomorrow.
                        </p>
                        <span className="text-xs text-destructive">High Priority</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-secondary mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Parent Conference Scheduled</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Meeting with Mrs. Wilson scheduled for January 18th at 3:00 PM.
                        </p>
                        <span className="text-xs text-secondary">Scheduled</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Grade Improvement</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Alex's math grade has improved from B+ to A- this quarter.
                        </p>
                        <span className="text-xs text-primary">Good News</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Wellness Updates
                  </CardTitle>
                  <CardDescription>Alex's mental health and wellness insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-chart-1 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Heart className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Positive Wellness Trend</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Alex has been consistently using mindfulness tools and reporting improved mood.
                        </p>
                        <span className="text-xs text-primary">7-day streak</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-secondary mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Sleep Pattern Improvement</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Better sleep schedule has correlated with improved academic performance.
                        </p>
                        <span className="text-xs text-secondary">Positive Impact</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-chart-5 border border-secondary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Target className="h-4 w-4 text-secondary mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Stress Management</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Alex is effectively using breathing exercises during high-stress periods.
                        </p>
                        <span className="text-xs text-secondary">Coping Well</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
