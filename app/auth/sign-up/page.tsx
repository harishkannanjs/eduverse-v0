"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<"student" | "teacher" | "parent">("student")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // pick redirect URL depending on environment (keeps previous logic)
      const redirectTo =
        process.env.NODE_ENV === "development"
          ? process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/login`
          : process.env.NEXT_PUBLIC_PROD_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/login`

      // Sign up the user (this will still create the user record)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      // if we got a user object, try to create profile and sign in (works when email confirmation is disabled)
      const createdUser = (data as any)?.user

      // If signUp returned a user id we proceed. If not, we still attempt a sign-in below.
      // Create / upsert profile (id = user's id). Use upsert so it doesn't fail if already present.
      if (createdUser?.id) {
        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            id: createdUser.id,
            email,
            full_name: fullName,
            role,
          },
          { onConflict: ["id"] }
        )
        if (profileError) {
          console.error("Profile creation error:", profileError)
        }
      }

      // Attempt to sign the user in immediately (this will succeed if email confirmation is not required)
      try {
        const signInResult = await supabase.auth.signInWithPassword({ email, password })

        if (signInResult.error) {
          // sign-in failed. Most likely email verification is required.
          // Fall back to the "check your email" success UI.
          console.warn("Automatic sign-in failed:", signInResult.error)
          setSuccess(true)
          setLoading(false)
          return
        }

        // Signed in successfully, redirect to dashboard (or wherever)
        setLoading(false)
        router.push("/dashboard")
        return
      } catch (siErr) {
        // sign-in attempt threw an error; show success fallback
        console.error("Sign-in attempt threw error:", siErr)
        setSuccess(true)
        setLoading(false)
        return
      }
    } catch (err) {
      console.error(err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">Account Created!</CardTitle>
            <CardDescription>Please check your email to verify your account</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              We've sent a verification link to {email}. Click the link to activate your account.
            </p>
            <Link href="/auth/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
          <CardDescription>Join EduVerse and start your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a password"
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: "student" | "teacher" | "parent") => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:underline">
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
