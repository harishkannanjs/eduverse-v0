// app/wellness/page.tsx

"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Heart, Zap, Smile } from "lucide-react"

export default function WellnessPage() {
  const [mood, setMood] = useState("")
  const [journal, setJournal] = useState("")

  return (
    <DashboardLayout title="Wellness Hub">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Check-in</CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button variant={mood === "great" ? "default" : "outline"} onClick={() => setMood("great")}>
                <Smile className="mr-2 h-4 w-4" /> Great
              </Button>
              <Button variant={mood === "ok" ? "default" : "outline"} onClick={() => setMood("ok")}>
                Okay
              </Button>
              <Button variant={mood === "bad" ? "default" : "outline"} onClick={() => setMood("bad")}>
                Not Good
              </Button>
            </div>
            <Textarea
              placeholder="Write a little about your day..."
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
            />
            <Button>Save Check-in</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mindfulness Exercises</CardTitle>
            <CardDescription>Take a moment to relax and refocus.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-24 flex-col">
              <Heart className="h-8 w-8 mb-2" />
              Breathing Exercise
            </Button>
            <Button variant="outline" className="h-24 flex-col">
              <Zap className="h-8 w-8 mb-2" />
              5-Minute Meditation
            </Button>
            <Button variant="outline" className="h-24 flex-col">
              <Smile className="h-8 w-8 mb-2" />
              Positive Affirmations
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
            }
