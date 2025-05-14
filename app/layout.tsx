import { Inter } from "next/font/google"
import type React from "react"
import { AuthProvider } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'

import './globals.css'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EduFundz",
  description: "Student loan application for YABATECH students",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'