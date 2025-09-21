import { createClient } from "@/lib/supabase/client"

export type UserRole = "student" | "teacher" | "parent"

export interface User {
  id: string
  email: string
  name: string
  username?: string
  role: UserRole
  avatar?: string
}

export interface RegisterUserData {
  name: string
  username: string
  email: string
  password: string
  role: UserRole
}

export const registerUser = async (userData: RegisterUserData): Promise<User | null> => {
  try {
    const supabase = createClient()

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", userData.username)
      .single()

    if (existingUser) {
      throw new Error("Username already exists. Please choose a different username.")
    }

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        data: {
          full_name: userData.name,
          username: userData.username,
          role: userData.role,
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    if (data.user) {
      return {
        id: data.user.id,
        email: data.user.email!,
        name: userData.name,
        username: userData.username,
        role: userData.role,
      }
    }

    return null
  } catch (error: any) {
    console.error("Registration error:", error)
    throw error
  }
}

export const authenticateUser = async (usernameOrEmail: string, password: string): Promise<User | null> => {
  try {
    const supabase = createClient()
    let email = usernameOrEmail

    // If input is a username, look up the email
    if (!usernameOrEmail.includes("@")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", usernameOrEmail)
        .single()

      if (!profile) {
        throw new Error("Username not found")
      }

      email = profile.email
    }

    // Sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (data.user) {
      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (!profile) {
        return {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.full_name || "",
          username: data.user.user_metadata?.username || "",
          role: data.user.user_metadata?.role || "student",
        }
      }

      return {
        id: profile.id,
        email: profile.email,
        name: profile.full_name || "",
        username: profile.username || "",
        role: profile.role,
      }
    }

    return null
  } catch (error: any) {
    console.error("Authentication error:", error)
    throw error
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const supabase = createClient()

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
        role: user.user_metadata?.role || "student",
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
    console.error("Get current user error:", error)
    return null
  }
}

export const logout = async (): Promise<void> => {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error("Logout error:", error)
  }
}
