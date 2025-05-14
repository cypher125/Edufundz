"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#F4FFC3] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-[#5D8736]">EduFundz</CardTitle>
          <p className="text-center text-sm text-gray-600">Login to your account</p>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <Button className="w-full bg-[#5D8736] hover:bg-[#809D3C] text-white">Log in</Button>
          <div className="flex items-center space-x-2">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-sm text-gray-500">Or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <Button variant="outline" className="w-full">
            Sign up
          </Button>
          <a href="#" className="text-sm text-[#5D8736] hover:underline self-center">
            Forgot password?
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}

