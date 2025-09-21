"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface AIChatProps {
  className?: string
}

export function AIChat({ className }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { id: Date.now().toString(), role: "user" as const, content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: data.response || "I'm sorry, I couldn't generate a response."
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: "I'm sorry, I'm having trouble connecting right now. Please try again."
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: "I'm sorry, something went wrong. Please try again."
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="fixed bottom-4 right-4 w-80 h-[500px] shadow-lg flex flex-col">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Tutor
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm">
                    Hi! I'm your AI tutor. Ask me anything about your studies!
                  </div>
                )}
                {messages.map((message: Message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div className="flex-shrink-0">
                        {message.role === "user" ? (
                          <User className="h-6 w-6 p-1 bg-primary text-primary-foreground rounded-full" />
                        ) : (
                          <Bot className="h-6 w-6 p-1 bg-secondary text-secondary-foreground rounded-full" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 text-sm break-words ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="flex gap-2 max-w-[80%]">
                      <Bot className="h-6 w-6 p-1 bg-secondary text-secondary-foreground rounded-full flex-shrink-0" />
                      <div className="rounded-lg p-3 text-sm bg-secondary text-secondary-foreground">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
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
            <div className="p-4 border-t flex-shrink-0">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1"
                  maxLength={500}
                />
                <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
