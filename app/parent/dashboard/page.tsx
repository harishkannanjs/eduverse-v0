"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Brain,
  Bell,
  MessageSquare,
  Calendar,
  BookOpen,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Heart,
  User,
} from "lucide-react"

export default function ParentDashboard() {
  return (
    <DashboardLayout title="Parent Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-2">Welcome, Michael!</h2>
          <p className="text-muted-foreground">
            Alex is doing great this week! Check out the latest progress updates and upcoming events below.
          </p>
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

        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progress">Progress Overview</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Updates</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6">
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
                      <p className="text-xs text-muted-foreground">
                        Responds well to diagrams, charts, and visual representations
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Kinesthetic Learning</span>
                        <span className="font-medium">70%</span>
                      </div>
                      <Progress value={70} className="h-2" />
                      <p className="text-xs text-muted-foreground">Benefits from hands-on activities and experiments</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Auditory Learning</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                      <p className="text-xs text-muted-foreground">Moderate preference for verbal explanations</p>
                    </div>
                  </div>

                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Recommended Study Methods</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Use mind maps and flowcharts for complex topics</li>
                      <li>• Incorporate interactive simulations in science</li>
                      <li>• Practice problems with visual step-by-step solutions</li>
                      <li>• Take regular breaks during study sessions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Important Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Important Alerts
                  </CardTitle>
                  <CardDescription>Notifications requiring your attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Assignment Due Tomorrow</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Chemistry lab report is due tomorrow. Alex hasn't started yet.
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">
                              Send Reminder
                            </Button>
                            <Button size="sm" variant="outline">
                              Contact Teacher
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Bell className="h-4 w-4 text-secondary mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Parent Conference Scheduled</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Virtual meeting with Mrs. Wilson scheduled for next Tuesday at 3:00 PM.
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">
                              Add to Calendar
                            </Button>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Excellent Progress in Math</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Alex scored in the top 10% of the class on the recent algebra test. Great work!
                          </p>
                          <Badge variant="secondary" className="mt-2">
                            Achievement
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Updates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Updates
                  </CardTitle>
                  <CardDescription>Latest activity and system notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Grade Updated</h4>
                        <p className="text-xs text-muted-foreground">
                          History essay grade posted: A- (88%). Great improvement in writing structure.
                        </p>
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">New Assignment Posted</h4>
                        <p className="text-xs text-muted-foreground">
                          Chemistry: Molecular structure worksheet assigned. Due Friday.
                        </p>
                        <span className="text-xs text-muted-foreground">1 day ago</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-chart-2 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Attendance Update</h4>
                        <p className="text-xs text-muted-foreground">
                          Perfect attendance maintained for the month. Keep it up!
                        </p>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-chart-5 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Wellness Check-in</h4>
                        <p className="text-xs text-muted-foreground">
                          Alex completed daily mood check-in. Feeling confident and motivated.
                        </p>
                        <span className="text-xs text-muted-foreground">3 days ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Messages with Teachers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Messages with Teachers
                  </CardTitle>
                  <CardDescription>Recent communications about Alex's progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">SW</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Mrs. Wilson (Math Teacher)</h4>
                          <span className="text-xs text-muted-foreground">1h ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Alex did exceptionally well on today's quiz! His understanding of quadratic equations has
                          really improved.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                          Reply
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-secondary">JD</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Mr. Davis (Chemistry)</h4>
                          <span className="text-xs text-muted-foreground">2d ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Alex might benefit from some extra practice with balancing chemical equations. I've shared
                          some resources.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                          Reply
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-chart-1 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">LM</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Ms. Martinez (History)</h4>
                          <span className="text-xs text-muted-foreground">3d ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Great job on the World War II project! Alex's research was thorough and well-presented.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start New Conversation
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common tasks and helpful resources</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <div className="font-medium">Schedule Parent Conference</div>
                          <div className="text-xs text-muted-foreground">Meet with Alex's teachers</div>
                        </div>
                      </div>
                    </Button>

                    <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-secondary" />
                        <div className="text-left">
                          <div className="font-medium">Download Progress Report</div>
                          <div className="text-xs text-muted-foreground">Detailed academic summary</div>
                        </div>
                      </div>
                    </Button>

                    <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <div className="font-medium">Notification Settings</div>
                          <div className="text-xs text-muted-foreground">Customize alerts and updates</div>
                        </div>
                      </div>
                    </Button>

                    <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-secondary" />
                        <div className="text-left">
                          <div className="font-medium">Learning Resources</div>
                          <div className="text-xs text-muted-foreground">Study guides and materials</div>
                        </div>
                      </div>
                    </Button>

                    <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <div className="font-medium">Wellness Support</div>
                          <div className="text-xs text-muted-foreground">Mental health resources</div>
                        </div>
                      </div>
                    </Button>
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
