import { createClient as createServerClient } from "@/lib/supabase/server"
import type { User, UserRole } from "@/lib/auth-client" // reuse types

export const getCurrentUserServer = async (): Promise<User | null> => {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!profile) {
      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || "",
        username: user.user_metadata?.username || "",
        role: (user.user_metadata?.role as UserRole) || "student",
      }
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.full_name || "",
      username: profile.username || "",
      role: profile.role,
    }
  } catch (error) {
    console.error("Get current user server error:", error)
    return null
  }
}
