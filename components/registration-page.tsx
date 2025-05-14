"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function RegistrationPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(false)

  const toggleForm = () => setIsLogin(!isLogin)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div className="w-full max-w-md" variants={containerVariants} initial="hidden" animate="visible">
        <Card className="bg-white shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">EDUFUNDZ</CardTitle>
            <p className="text-center text-sm text-gray-600">
              {isLogin ? "Login to your account" : "Create an account"}
            </p>
          </CardHeader>
          <motion.div variants={formVariants}>
            <CardContent className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="name" placeholder="John Doe" type="text" className="pl-10" />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" placeholder="m@example.com" type="email" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="password" type={showPassword ? "text" : "password"} className="pl-10 pr-10" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                {isLogin ? "Log in" : "Sign up"}
              </Button>
              <div className="text-sm text-center">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={toggleForm} className="ml-1 text-emerald-600 hover:underline">
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </div>
              <Link href="/" className="text-sm text-emerald-600 hover:underline self-center">
                Back to Home
              </Link>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}

