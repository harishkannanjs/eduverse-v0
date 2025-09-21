"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">Email Verification Error</CardTitle>
          <CardDescription>There was a problem verifying your email</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              The email verification link may be expired or invalid. Please try signing up again or contact support.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Link href="/auth/sign-up">
              <Button className="w-full">Sign Up Again</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                Already have an account? Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
