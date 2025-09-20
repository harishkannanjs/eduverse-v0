"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  BookOpen,
  Brain,
  BarChart3,
  Plus,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileText,
  MessageSquare,
} from "lucide-react"

export default function TeacherDashboard() {
  return (
    <DashboardLayout title="Teacher Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-2">Good morning, Sarah!</h2>
          <p className="text-muted-foreground">
            You have 3 classes today and 12 assignments to review. Your students are performing well this week.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">127</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
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
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Active Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-1 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-sm text-muted-foreground">Avg Performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-5 rounded-lg">
                  <FileText className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="classes">Class Management</TabsTrigger>
            <TabsTrigger value="lessons">AI Lesson Plans</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Class Creation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Class Creation & Management
                  </CardTitle>
                  <CardDescription>Create new classes and manage existing ones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Class
                  </Button>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Algebra II - Period 3</h4>
                        <p className="text-sm text-muted-foreground">28 students • Room 204</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">Active</Badge>
                          <Badge variant="outline">Mon, Wed, Fri</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Pre-Calculus - Period 5</h4>
                        <p className="text-sm text-muted-foreground">24 students • Room 204</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">Active</Badge>
                          <Badge variant="outline">Tue, Thu</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Geometry - Period 1</h4>
                        <p className="text-sm text-muted-foreground">32 students • Room 204</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">Active</Badge>
                          <Badge variant="outline">Daily</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Schedule
                  </CardTitle>
                  <CardDescription>Your classes and activities for today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Geometry - Period 1</h4>
                        <p className="text-sm text-muted-foreground">8:00 AM - 9:00 AM • Room 204</p>
                        <Badge variant="secondary" className="mt-1">
                          In Progress
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="p-2 bg-muted rounded">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Algebra II - Period 3</h4>
                        <p className="text-sm text-muted-foreground">10:30 AM - 11:30 AM • Room 204</p>
                        <Badge variant="outline" className="mt-1">
                          Upcoming
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="p-2 bg-muted rounded">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Pre-Calculus - Period 5</h4>
                        <p className="text-sm text-muted-foreground">1:00 PM - 2:00 PM • Room 204</p>
                        <Badge variant="outline" className="mt-1">
                          Upcoming
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="p-2 bg-muted rounded">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Parent Conferences</h4>
                        <p className="text-sm text-muted-foreground">3:00 PM - 5:00 PM • Virtual</p>
                        <Badge variant="outline" className="mt-1">
                          Scheduled
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Lesson Plan Generator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Lesson Plan Generator
                  </CardTitle>
                  <CardDescription>Create personalized lesson plans with AI assistance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">
                    <Brain className="h-4 w-4 mr-2" />
                    Generate New Lesson Plan
                  </Button>

                  <div className="space-y-3">
                    <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-secondary/10 rounded">
                          <Brain className="h-4 w-4 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Quadratic Functions - Interactive Approach</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            AI suggests using graphing calculators and real-world examples for better engagement.
                            Estimated time: 50 minutes.
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">
                              View Plan
                            </Button>
                            <Button size="sm" variant="outline">
                              Customize
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-primary/10 rounded">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Geometry Proofs - Step-by-Step Method</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Scaffolded approach with visual aids and peer collaboration. Includes assessment rubric.
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">
                              View Plan
                            </Button>
                            <Button size="sm" variant="outline">
                              Use Template
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Lesson Plans */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Lesson Plans
                  </CardTitle>
                  <CardDescription>Your recently created and used lesson plans</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Linear Equations Review</h4>
                        <p className="text-sm text-muted-foreground">Algebra II • Used 2 days ago</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">AI Generated</Badge>
                          <Badge variant="outline">50 min</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Reuse
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Triangle Congruence</h4>
                        <p className="text-sm text-muted-foreground">Geometry • Used 1 week ago</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">AI Generated</Badge>
                          <Badge variant="outline">45 min</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Reuse
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Polynomial Functions</h4>
                        <p className="text-sm text-muted-foreground">Pre-Calculus • Used 1 week ago</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">Custom</Badge>
                          <Badge variant="outline">60 min</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Class Performance Analytics
                  </CardTitle>
                  <CardDescription>Track student progress and identify areas for improvement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Algebra II - Period 3</span>
                        <span className="font-medium">87% avg</span>
                      </div>
                      <Progress value={87} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>28 students</span>
                        <span>↑ 5% from last month</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Pre-Calculus - Period 5</span>
                        <span className="font-medium">92% avg</span>
                      </div>
                      <Progress value={92} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>24 students</span>
                        <span>↑ 3% from last month</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Geometry - Period 1</span>
                        <span className="font-medium">84% avg</span>
                      </div>
                      <Progress value={84} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>32 students</span>
                        <span>↓ 2% from last month</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    View Detailed Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Student Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Student Alerts & Insights
                  </CardTitle>
                  <CardDescription>AI-powered insights about student performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">3 Students Need Attention</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Emma, Jake, and Maria have shown declining performance in recent assignments.
                          </p>
                          <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                            Review Students
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-4 w-4 text-secondary mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Strong Performance in Geometry</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            85% of students mastered triangle congruence concepts. Consider advancing to similarity.
                          </p>
                          <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                            View Insights
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Engagement Improvement</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Interactive lessons increased participation by 40% in Period 3. Recommend similar
                            approaches.
                          </p>
                          <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                            Apply to Other Classes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Recent Messages
                  </CardTitle>
                  <CardDescription>Communications with students and parents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">MB</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Mrs. Brown (Parent)</h4>
                          <span className="text-xs text-muted-foreground">2h ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Thank you for the extra help with Emma's algebra homework. She's much more confident now.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                          Reply
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-secondary">AJ</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Alex Johnson (Student)</h4>
                          <span className="text-xs text-muted-foreground">1d ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Could you explain the quadratic formula again? I'm still confused about the discriminant part.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View All Messages
                  </Button>
                </CardContent>
              </Card>

              {/* Announcements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Class Announcements
                  </CardTitle>
                  <CardDescription>Send updates to your classes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Announcement
                  </Button>

                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Quiz Reminder - Algebra II</h4>
                        <Badge variant="secondary">Sent</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Don't forget about tomorrow's quiz on quadratic equations. Review chapters 4-5.
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">Sent to 28 students</span>
                        <span className="text-xs text-muted-foreground">Yesterday</span>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Parent Conference Schedule</h4>
                        <Badge variant="outline">Draft</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Parent conferences are scheduled for next week. Please check your email for time slots.
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">Ready to send</span>
                        <Button size="sm" variant="outline">
                          Send Now
                        </Button>
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
