"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CommunicationHub } from "@/components/communication-hub"
import { getCurrentUser } from "@/lib/auth-client"

export default function CommunicationPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <DashboardLayout title="Communication Hub">
      <CommunicationHub />
    </DashboardLayout>
  )
}
