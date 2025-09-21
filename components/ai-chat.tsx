"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Minimize2, Maximize2, RotateCcw, Copy, Check, ArrowUp, ArrowDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIChatProps {
  className?: string
}

export function AIChat({ className }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current && isAtBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading, isAtBottom])

  useEffect(() => {
    const scrollContainer = messagesContainerRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50
      setIsAtBottom(isNearBottom)
      setShowScrollButtons(scrollHeight > clientHeight + 100)

      // Reset unread count when user scrolls to bottom
      if (isNearBottom && unreadCount > 0) {
        setUnreadCount(0)
      }
    }

    scrollContainer.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => scrollContainer.removeEventListener("scroll", handleScroll)
  }, [unreadCount])

  useEffect(() => {
    if (!isOpen || isMinimized) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage && lastMessage.role === "assistant") {
        setUnreadCount((prev) => prev + 1)
      }
    }
  }, [messages, isOpen, isMinimized])

  useEffect(() => {
    const savedMessages = localStorage.getItem("aiChatHistory")
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(
          parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        )
      } catch (error) {
        console.error("Error loading chat history:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("aiChatHistory", JSON.stringify(messages))
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setIsAtBottom(true) // Ensure we scroll to bottom for new messages

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response || "I'm sorry, I couldn't generate a response.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm sorry, I'm having trouble connecting right now. Please try again.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error("Failed to copy message:", error)
    }
  }

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setIsAtBottom(true)
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem("aiChatHistory")
    setUnreadCount(0)
  }

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const openChat = () => {
    setIsOpen(true)
    setIsMinimized(false)
    setUnreadCount(0)
  }

  return (
    <div className={className}>
      {!isOpen ? (
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={openChat}
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 relative"
            size="icon"
          >
            <Bot className="h-7 w-7" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      ) : (
        <Card
          className={`fixed bottom-4 right-4 shadow-xl border-2 flex flex-col transition-all duration-200 ${
            isMinimized ? "w-80 h-16" : "w-80 sm:w-96 h-[500px] sm:h-[600px]"
          }`}
        >
          <CardHeader className="pb-3 flex-shrink-0 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Tutor
                {messages.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {messages.length} messages
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 p-0 hover:bg-muted"
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-muted"
                  title="Close"
                >
                  ×
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
              <div className="relative flex-1 overflow-hidden">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                  <div className="p-4 space-y-4 min-h-full" ref={messagesContainerRef}>
                    {messages.length === 0 && (
                      <div className="text-center text-muted-foreground text-sm py-8">
                        <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="font-medium mb-2">Hi! I'm your AI tutor.</p>
                        <p>Ask me anything about your studies, homework, or learning strategies!</p>
                      </div>
                    )}

                    {messages.map((message: Message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 group ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <div className="flex-shrink-0 mt-1">
                            {message.role === "user" ? (
                              <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                            ) : (
                              <div className="h-8 w-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center">
                                <Bot className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <div
                              className={`rounded-lg p-3 text-sm break-words relative ${
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {message.content}
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                                  message.role === "user"
                                    ? "hover:bg-primary-foreground/20 text-primary-foreground"
                                    : "hover:bg-muted-foreground/20"
                                }`}
                                onClick={() => copyMessage(message.content, message.id)}
                                title="Copy message"
                              >
                                {copiedMessageId === message.id ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                            <div
                              className={`text-xs text-muted-foreground px-1 ${
                                message.role === "user" ? "text-right" : "text-left"
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="flex gap-3 max-w-[85%]">
                          <div className="h-8 w-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="rounded-lg p-3 text-sm bg-muted">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {showScrollButtons && (
                  <div className="absolute right-2 top-2 flex flex-col gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                      onClick={scrollToTop}
                      title="Scroll to top"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    {!isAtBottom && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                        onClick={scrollToBottom}
                        title="Scroll to bottom"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 border-t flex-shrink-0 bg-background">
                {messages.length > 0 && (
                  <div className="flex justify-between items-center mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear Chat
                    </Button>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1"
                    maxLength={1000}
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="flex-shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <div className="text-xs text-muted-foreground mt-2 text-center">{input.length}/1000 characters</div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
