"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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

  const announcements = [
    {
      id: "1",
      title: "Parent-Teacher Conference Week",
      content: "Virtual conferences scheduled for next week. Please check your email for time slots.",
      author: "School Administration",
      timestamp: "2h ago",
      priority: "high" as const,
    },
    {
      id: "2",
      title: "Math Department Update",
      content: "New interactive learning tools have been added to the algebra curriculum.",
      author: "Mrs. Wilson",
      timestamp: "1d ago",
      priority: "medium" as const,
    },
    {
      id: "3",
      title: "Wellness Week Activities",
      content: "Join us for mindfulness sessions and stress management workshops this week.",
      author: "Counseling Department",
      timestamp: "2d ago",
      priority: "low" as const,
    },
  ]

  // Load conversations on component mount
  useEffect(() => {
    loadConversations()
  }, [])

  // Load messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/messages')
      const data = await response.json()
      if (response.ok) {
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
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
      console.error('Error loading messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content: newMessage,
          senderId: 'current_user_id', // In real app, get from auth
          senderName: 'Current User', // In real app, get from profile
          senderRole: 'student', // In real app, get from profile
        }),
      })
      
      const data = await response.json()
      if (response.ok) {
        setNewMessage("")
        // Add the new message to the list
        setMessages(prev => [...prev, data.message])
        // Refresh conversations to update last message
        await loadConversations()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
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
                                By {announcement.author} • {announcement.timestamp}
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Chemistry Champions</h4>
                        <p className="text-sm text-muted-foreground">12 members</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Study group for advanced chemistry topics and lab work preparation.
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Active</Badge>
                      <Button size="sm" variant="outline">
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <Users className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Math Masters</h4>
                        <p className="text-sm text-muted-foreground">8 members</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Collaborative problem-solving for algebra and pre-calculus students.
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Active</Badge>
                      <Button size="sm" variant="outline">
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-chart-1 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">History Buffs</h4>
                        <p className="text-sm text-muted-foreground">15 members</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Discussion group for world history topics and research projects.
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Recruiting</Badge>
                      <Button size="sm" variant="outline">
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
