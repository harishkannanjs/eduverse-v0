"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getCurrentUser, type User } from "@/lib/auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  Send,
  Users,
  Search,
  Plus,
  Phone,
  Video,
  Paperclip,
  MoreHorizontal,
  Star,
  Archive,
} from "lucide-react"

interface Message {
  id: string
  sender: {
    name: string
    role: "student" | "teacher" | "parent"
    avatar?: string
  }
  content: string
  timestamp: string
  isRead: boolean
}

interface Conversation {
  id: string
  participants: Array<{
    name: string
    role: "student" | "teacher" | "parent"
    avatar?: string
  }>
  lastMessage: string
  timestamp: string
  unreadCount: number
  isStarred: boolean
}

export function CommunicationHub() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [loadingUser, setLoadingUser] = useState(true)
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false)
  const [showJoinGroupDialog, setShowJoinGroupDialog] = useState(false)
  const [showCreateAnnouncementDialog, setShowCreateAnnouncementDialog] = useState(false)
  const [joinGroupCode, setJoinGroupCode] = useState("")
  const [newGroupForm, setNewGroupForm] = useState({
    name: "",
    description: "",
    subject: "",
    isPublic: true,
    maxMembers: 20,
  })
  const [newAnnouncementForm, setNewAnnouncementForm] = useState({
    title: "",
    content: "",
    targetAudience: "all",
    priority: "medium",
  })

  // Load user and data on component mount
  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error("Error loading current user:", error)
    } finally {
      setLoadingUser(false)
    }
  }

  const loadConversations = async () => {
    if (!currentUser) return
    try {
      const response = await fetch(`/api/messages?userId=${currentUser.id}`)
      const data = await response.json()
      if (response.ok) {
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error("Error loading conversations:", error)
    }
  }

  const loadAnnouncements = async () => {
    if (!currentUser) return
    try {
      const response = await fetch(`/api/announcements`)
      const data = await response.json()
      if (response.ok) {
        setAnnouncements(data.announcements || [])
      }
    } catch (error) {
      console.error("Error loading announcements:", error)
    }
  }

  const loadGroups = async () => {
    if (!currentUser) return
    try {
      const response = await fetch(`/api/groups?userId=${currentUser.id}`)
      const data = await response.json()
      if (response.ok) {
        setGroups(data.groups || [])
      }
    } catch (error) {
      console.error("Error loading groups:", error)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`)
      const data = await response.json()
      if (response.ok) {
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content: newMessage,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentUser.role,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setNewMessage("")
        // Add the new message to the list
        setMessages((prev) => [...prev, data.message])
        // Refresh conversations to update last message
        await loadConversations()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const createGroup = async () => {
    if (!newGroupForm.name || !newGroupForm.description || !currentUser) return

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newGroupForm,
          createdBy: {
            id: currentUser.id,
            name: currentUser.name,
            role: currentUser.role,
          },
        }),
      })

      if (response.ok) {
        setShowCreateGroupDialog(false)
        setNewGroupForm({
          name: "",
          description: "",
          subject: "",
          isPublic: true,
          maxMembers: 20,
        })
        await loadGroups()
      }
    } catch (error) {
      console.error("Error creating group:", error)
    }
  }

  const joinGroup = async (groupId: string) => {
    if (!currentUser) return

    try {
      const response = await fetch("/api/groups", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "join",
          groupId: groupId,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          inviteCode: joinGroupCode,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setJoinGroupCode("")
        setShowJoinGroupDialog(false)
        await loadGroups()
      } else {
        console.error("Error joining group:", data.error)
        alert(data.error || "Failed to join group")
      }
    } catch (error) {
      console.error("Error joining group:", error)
      alert("Failed to join group. Please try again.")
    }
  }

  const joinGroupByCode = async () => {
    if (!currentUser || !joinGroupCode.trim()) return

    try {
      const group = groups.find((g) => g.inviteCode === joinGroupCode)
      if (!group) {
        alert("Invalid invite code. Please check and try again.")
        return
      }

      if (group.members.some((m: any) => m.id === currentUser.id)) {
        alert("You are already a member of this group.")
        setJoinGroupCode("")
        setShowJoinGroupDialog(false)
        return
      }

      await joinGroup(group.id)
    } catch (error) {
      console.error("Error joining group by code:", error)
      alert("Failed to join group. Please try again.")
    }
  }

  const createAnnouncement = async () => {
    if (!newAnnouncementForm.title || !newAnnouncementForm.content || !currentUser || currentUser.role !== "teacher")
      return

    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newAnnouncementForm,
          authorId: currentUser.id,
          authorName: currentUser.name,
        }),
      })

      if (response.ok) {
        setShowCreateAnnouncementDialog(false)
        setNewAnnouncementForm({
          title: "",
          content: "",
          targetAudience: "all",
          priority: "medium",
        })
        await loadAnnouncements()
      }
    } catch (error) {
      console.error("Error creating announcement:", error)
    }
  }

  const getRoleColor = (role: "student" | "teacher" | "parent") => {
    switch (role) {
      case "student":
        return "bg-primary/10 text-primary"
      case "teacher":
        return "bg-secondary/10 text-secondary"
      case "parent":
        return "bg-chart-1 text-primary"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "border-destructive bg-destructive/5"
      case "medium":
        return "border-secondary bg-secondary/5"
      case "low":
        return "border-primary bg-primary/5"
      default:
        return "border-border"
    }
  }

  useEffect(() => {
    loadCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      loadConversations()
      loadAnnouncements()
      loadGroups()
    }
  }, [currentUser])

  useEffect(() => {
    if (selectedConversation && currentUser) {
      loadMessages(selectedConversation)
    }
  }, [selectedConversation, currentUser])

  if (loadingUser) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your communication hub...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Unable to load user information. Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <Tabs defaultValue="messages" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="groups">Study Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="flex-1 flex gap-4 mt-4">
          {/* Conversations List */}
          <Card className="w-1/3 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="space-y-1 p-4 pt-0">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation === conversation.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex -space-x-2">
                          {conversation.participants.slice(0, 2).map((participant, index) => (
                            <Avatar key={index} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                              <AvatarFallback className={getRoleColor(participant.role)}>
                                {participant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm truncate">
                                {conversation.participants.map((p) => p.name).join(", ")}
                              </span>
                              {conversation.isStarred && <Star className="h-3 w-3 text-secondary fill-current" />}
                            </div>
                            <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-1">{conversation.lastMessage}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex gap-1">
                              {conversation.participants.map((participant, index) => (
                                <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                  {participant.role}
                                </Badge>
                              ))}
                            </div>
                            {conversation.unreadCount > 0 && (
                              <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {conversations
                          .find((c) => c.id === selectedConversation)
                          ?.participants.slice(0, 2)
                          .map((participant, index) => (
                            <Avatar key={index} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                              <AvatarFallback className={getRoleColor(participant.role)}>
                                {participant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {conversations
                            .find((c) => c.id === selectedConversation)
                            ?.participants.map((p) => p.name)
                            .join(", ")}
                        </h3>
                        <p className="text-sm text-muted-foreground">Online</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                            <AvatarFallback className={getRoleColor(message.sender.role)}>
                              {message.sender.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{message.sender.name}</span>
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {message.sender.role}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <Separator />
                  <div className="p-4">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[60px] resize-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim() || isLoading}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Select a conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>School Announcements</CardTitle>
                  <CardDescription>Important updates and notifications</CardDescription>
                </div>
                {currentUser.role === "teacher" && (
                  <Dialog open={showCreateAnnouncementDialog} onOpenChange={setShowCreateAnnouncementDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Announcement
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Announcement</DialogTitle>
                        <DialogDescription>Share important updates with students and parents.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="ann-title">Title</Label>
                          <Input
                            id="ann-title"
                            value={newAnnouncementForm.title}
                            onChange={(e) => setNewAnnouncementForm({ ...newAnnouncementForm, title: e.target.value })}
                            placeholder="Enter announcement title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ann-content">Content</Label>
                          <Textarea
                            id="ann-content"
                            value={newAnnouncementForm.content}
                            onChange={(e) =>
                              setNewAnnouncementForm({ ...newAnnouncementForm, content: e.target.value })
                            }
                            placeholder="Enter announcement details"
                            rows={4}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="ann-audience">Target Audience</Label>
                            <Select
                              value={newAnnouncementForm.targetAudience}
                              onValueChange={(value) =>
                                setNewAnnouncementForm({ ...newAnnouncementForm, targetAudience: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Everyone</SelectItem>
                                <SelectItem value="students">Students</SelectItem>
                                <SelectItem value="parents">Parents</SelectItem>
                                <SelectItem value="teachers">Teachers</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ann-priority">Priority</Label>
                            <Select
                              value={newAnnouncementForm.priority}
                              onValueChange={(value) =>
                                setNewAnnouncementForm({ ...newAnnouncementForm, priority: value })
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
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateAnnouncementDialog(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={createAnnouncement}
                          disabled={!newAnnouncementForm.title || !newAnnouncementForm.content}
                        >
                          Create Announcement
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <Card key={announcement.id} className={`${getPriorityColor(announcement.priority)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{announcement.title}</h4>
                              <Badge
                                variant={announcement.priority === "high" ? "destructive" : "secondary"}
                                className="text-xs"
                              >
                                {announcement.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{announcement.content}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                By {announcement.author?.name || announcement.author} •{" "}
                                {new Date(announcement.timestamp).toLocaleDateString()}
                              </span>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Star className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Archive className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Study Groups</CardTitle>
                  <CardDescription>Collaborative learning spaces</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={showJoinGroupDialog} onOpenChange={setShowJoinGroupDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Join Group</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Join Group</DialogTitle>
                        <DialogDescription>Enter an invite code to join an existing group.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="join-code">Invite Code</Label>
                          <Input
                            id="join-code"
                            value={joinGroupCode}
                            onChange={(e) => setJoinGroupCode(e.target.value.toUpperCase())}
                            placeholder="Enter 8-character invite code"
                            maxLength={8}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowJoinGroupDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={joinGroupByCode} disabled={!joinGroupCode.trim()}>
                          Join Group
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={showCreateGroupDialog} onOpenChange={setShowCreateGroupDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Group
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Study Group</DialogTitle>
                        <DialogDescription>
                          Create a collaborative learning space for students and teachers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="group-name">Group Name</Label>
                          <Input
                            id="group-name"
                            value={newGroupForm.name}
                            onChange={(e) => setNewGroupForm({ ...newGroupForm, name: e.target.value })}
                            placeholder="Enter group name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="group-desc">Description</Label>
                          <Textarea
                            id="group-desc"
                            value={newGroupForm.description}
                            onChange={(e) => setNewGroupForm({ ...newGroupForm, description: e.target.value })}
                            placeholder="Describe the group's purpose"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="group-subject">Subject</Label>
                            <Input
                              id="group-subject"
                              value={newGroupForm.subject}
                              onChange={(e) => setNewGroupForm({ ...newGroupForm, subject: e.target.value })}
                              placeholder="e.g., Mathematics"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="group-max">Max Members</Label>
                            <Input
                              id="group-max"
                              type="number"
                              min="5"
                              max="50"
                              value={newGroupForm.maxMembers}
                              onChange={(e) =>
                                setNewGroupForm({ ...newGroupForm, maxMembers: Number.parseInt(e.target.value) || 20 })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateGroupDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createGroup} disabled={!newGroupForm.name || !newGroupForm.description}>
                          Create Group
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((group) => (
                  <Card key={group.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{group.name}</h4>
                          <p className="text-sm text-muted-foreground">{group.currentMembers} members</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant={group.isActive ? "secondary" : "outline"}>
                          {group.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <div className="flex gap-2">
                          {group.inviteCode && (
                            <Badge variant="outline" className="text-xs">
                              Code: {group.inviteCode}
                            </Badge>
                          )}
                          {!group.members.some((m: any) => m.id === currentUser.id) ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (group.isPublic && group.inviteCode) {
                                  setJoinGroupCode(group.inviteCode)
                                  joinGroup(group.id)
                                } else {
                                  // For private groups, show join dialog
                                  setShowJoinGroupDialog(true)
                                }
                              }}
                              disabled={group.currentMembers >= group.maxMembers}
                            >
                              {group.currentMembers >= group.maxMembers ? "Full" : "Join"}
                            </Button>
                          ) : (
                            <Badge variant="secondary">Joined</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {groups.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No study groups available</p>
                    <p className="text-sm">Create a new group to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
