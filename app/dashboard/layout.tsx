import { Inter } from "next/font/google"
import BottomNav from "@/components/bottom-nav"
import SideMenu from "@/components/side-menu"
import Header from "@/components/header"
import ProtectedRoute from "@/components/protected-route"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex bg-gray-50 min-h-screen">
        <div className="hidden md:block">
          <SideMenu />
        </div>
        <div className="flex-1">
          <Header />
          <main className="p-4 md:p-8 pt-16 md:pt-24 md:ml-64">{children}</main>
        </div>
        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}

