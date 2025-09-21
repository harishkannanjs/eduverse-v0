import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/auth-client"

// Mock groups data with proper membership management
const groups: any[] = [
  {
    id: "1",
    name: "Chemistry Champions",
    description: "Study group for advanced chemistry topics and lab work preparation.",
    subject: "Chemistry",
    createdBy: { id: "student_1", name: "Alex Johnson", role: "student" },
    adminIds: ["student_1"],
    maxMembers: 15,
    currentMembers: 3,
    isActive: true,
    isPublic: true, // Can be joined via link
    inviteCode: "CHEM2024",
    meetingSchedule: {
      days: ["Tuesday", "Thursday"],
      time: "4:00 PM",
      location: "Library Study Room B",
    },
    members: [
      { id: "student_1", name: "Alex Johnson", role: "student", joinedAt: "2024-01-15T10:00:00Z" },
      { id: "student_2", name: "Emma Davis", role: "student", joinedAt: "2024-01-16T14:30:00Z" },
      { id: "student_3", name: "Jake Wilson", role: "student", joinedAt: "2024-01-17T09:15:00Z" },
    ],
    createdAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
  },
  {
    id: "2",
    name: "Math Masters",
    description: "Collaborative problem-solving for algebra and pre-calculus students.",
    subject: "Mathematics",
    createdBy: { id: "teacher_1", name: "Mrs. Wilson", role: "teacher" },
    adminIds: ["teacher_1", "student_2"],
    maxMembers: 10,
    currentMembers: 3,
    isActive: true,
    isPublic: false, // Private group, admin adds members
    inviteCode: null,
    meetingSchedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time: "3:30 PM",
      location: "Room 201",
    },
    members: [
      { id: "teacher_1", name: "Mrs. Wilson", role: "teacher", joinedAt: "2024-01-10T08:00:00Z" },
      { id: "student_1", name: "Alex Johnson", role: "student", joinedAt: "2024-01-11T12:00:00Z" },
      { id: "student_2", name: "Emma Davis", role: "student", joinedAt: "2024-01-11T12:05:00Z" },
    ],
    createdAt: new Date(Date.now() - 3456000000).toISOString(), // 40 days ago
  },
  {
    id: "3",
    name: "History Buffs",
    description: "Discussion group for world history topics and research projects.",
    subject: "History",
    createdBy: { id: "parent_1", name: "Michael Brown", role: "parent" },
    adminIds: ["parent_1"],
    maxMembers: 20,
    currentMembers: 3,
    isActive: true,
    isPublic: true,
    inviteCode: "HIST2024",
    meetingSchedule: {
      days: ["Saturday"],
      time: "10:00 AM",
      location: "Community Center",
    },
    members: [
      { id: "parent_1", name: "Michael Brown", role: "parent", joinedAt: "2024-01-05T16:00:00Z" },
      { id: "student_1", name: "Alex Johnson", role: "student", joinedAt: "2024-01-06T18:30:00Z" },
      { id: "teacher_3", name: "Dr. Smith", role: "teacher", joinedAt: "2024-01-07T11:20:00Z" },
    ],
    createdAt: new Date(Date.now() - 4320000000).toISOString(), // 50 days ago
  },
]

// Helper function to check if user can access a group
function canUserAccessGroup(userId: string, group: any): boolean {
  // Users can see public groups or groups they're members of
  return group.isPublic || group.members.some((member: any) => member.id === userId)
}

// Helper function to check if user is admin of a group
function isUserAdmin(userId: string, group: any): boolean {
  return group.adminIds.includes(userId)
}

// Get all groups (filtered by access rights)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientUserId = searchParams.get("userId")
    const groupId = searchParams.get("groupId")

    // Server-side authentication: Get the actual authenticated user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify the client-supplied userId matches the authenticated user (prevent impersonation)
    if (clientUserId && clientUserId !== currentUser.id) {
      return Response.json({ error: "User ID mismatch" }, { status: 403 })
    }

    const userId = currentUser.id // Use server-validated user ID

    if (groupId) {
      // Get specific group details
      const group = groups.find((g) => g.id === groupId)
      if (!group) {
        return Response.json({ error: "Group not found" }, { status: 404 })
      }

      if (!canUserAccessGroup(userId, group)) {
        return Response.json({ error: "Access denied" }, { status: 403 })
      }

      return Response.json({ group })
    } else {
      // Get all groups the user can access
      const filteredGroups = groups.filter((g) => g.isActive).filter((g) => canUserAccessGroup(userId, g))

      return Response.json({ groups: filteredGroups })
    }
  } catch (error) {
    console.error("Error fetching groups:", error)
    return Response.json({ error: "Failed to fetch groups" }, { status: 500 })
  }
}

// Create a new group
export async function POST(request: NextRequest) {
  try {
    const { name, description, subject, maxMembers = 20, isPublic = true, meetingSchedule } = await request.json()

    if (!name || !description) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Server-side authentication: Get the actual authenticated user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    // Use authenticated user data instead of trusting client-supplied createdBy
    const createdBy = {
      id: currentUser.id,
      name: currentUser.name,
      role: currentUser.role,
    }

    // Generate invite code for public groups
    const inviteCode = isPublic ? generateInviteCode() : null

    const newGroup = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      subject: subject || "General",
      createdBy,
      adminIds: [createdBy.id],
      maxMembers,
      currentMembers: 1,
      isActive: true,
      isPublic,
      inviteCode,
      meetingSchedule: meetingSchedule || null,
      members: [
        {
          id: createdBy.id,
          name: createdBy.name,
          role: createdBy.role,
          joinedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    }

    groups.push(newGroup)

    return Response.json({
      group: newGroup,
      success: true,
    })
  } catch (error) {
    console.error("Error creating group:", error)
    return Response.json({ error: "Failed to create group" }, { status: 500 })
  }
}

// Join a group (via invite code or admin approval)
export async function PUT(request: NextRequest) {
  try {
    const { action, groupId, userId, userName, userRole, inviteCode } = await request.json()

    if (!action || !groupId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    const authenticatedUserId = currentUser.id
    const authenticatedUserName = currentUser.name
    const authenticatedUserRole = currentUser.role

    const group = groups.find((g) => g.id === groupId)
    if (!group) {
      return Response.json({ error: "Group not found" }, { status: 404 })
    }

    if (action === "join") {
      // Check if user is already a member
      if (group.members.some((m: any) => m.id === authenticatedUserId)) {
        return Response.json({ error: "Already a member" }, { status: 400 })
      }

      // Check if group is full
      if (group.currentMembers >= group.maxMembers) {
        return Response.json({ error: "Group is full" }, { status: 400 })
      }

      if (group.isPublic) {
        if (group.inviteCode && inviteCode && group.inviteCode !== inviteCode) {
          return Response.json({ error: "Invalid invite code" }, { status: 400 })
        }
        // For public groups without invite codes, allow direct joining
      } else {
        // Private groups require admin approval or invite code
        if (!inviteCode || group.inviteCode !== inviteCode) {
          return Response.json(
            { error: "This is a private group. Contact an admin to be added or use the correct invite code." },
            { status: 403 },
          )
        }
      }

      // Add user to group
      group.members.push({
        id: authenticatedUserId,
        name: authenticatedUserName,
        role: authenticatedUserRole,
        joinedAt: new Date().toISOString(),
      })
      group.currentMembers += 1

      return Response.json({ success: true, message: "Joined group successfully" })
    }

    if (action === "leave") {
      // Check if user is a member
      const memberIndex = group.members.findIndex((m: any) => m.id === authenticatedUserId)
      if (memberIndex === -1) {
        return Response.json({ error: "Not a member" }, { status: 400 })
      }

      // Remove user from group
      group.members.splice(memberIndex, 1)
      group.currentMembers -= 1

      // If this was an admin leaving, handle admin transfer
      if (group.adminIds.includes(authenticatedUserId)) {
        group.adminIds = group.adminIds.filter((id: string) => id !== authenticatedUserId)
        // If no admins left, make the creator admin again or transfer to oldest member
        if (group.adminIds.length === 0 && group.members.length > 0) {
          group.adminIds.push(group.members[0].id)
        }
      }

      return Response.json({ success: true, message: "Left group successfully" })
    }

    if (action === "add_member") {
      const { targetUserId, targetUserName, targetUserRole } = await request.json()

      // Check if requester is admin
      if (!isUserAdmin(authenticatedUserId, group)) {
        return Response.json({ error: "Only admins can add members" }, { status: 403 })
      }

      // Check if target user is already a member
      if (group.members.some((m: any) => m.id === targetUserId)) {
        return Response.json({ error: "User is already a member" }, { status: 400 })
      }

      // Check if group is full
      if (group.currentMembers >= group.maxMembers) {
        return Response.json({ error: "Group is full" }, { status: 400 })
      }

      // Add user to group
      group.members.push({
        id: targetUserId,
        name: targetUserName,
        role: targetUserRole,
        joinedAt: new Date().toISOString(),
      })
      group.currentMembers += 1

      return Response.json({ success: true, message: "Member added successfully" })
    }

    return Response.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating group membership:", error)
    return Response.json({ error: "Failed to update group membership" }, { status: 500 })
  }
}

// Delete a group (admins only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get("groupId")
    const userId = searchParams.get("userId")

    if (!groupId || !userId) {
      return Response.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const groupIndex = groups.findIndex((g) => g.id === groupId)
    if (groupIndex === -1) {
      return Response.json({ error: "Group not found" }, { status: 404 })
    }

    const group = groups[groupIndex]

    // Check if user is admin
    if (!isUserAdmin(userId, group)) {
      return Response.json({ error: "Only admins can delete groups" }, { status: 403 })
    }

    // Remove the group
    groups.splice(groupIndex, 1)

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting group:", error)
    return Response.json({ error: "Failed to delete group" }, { status: 500 })
  }
}

// Helper function to generate invite codes
function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
