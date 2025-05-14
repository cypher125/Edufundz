"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const loanReasons = [
  "Tuition Fees",
  "Books and Study Materials",
  "Project Research",
  "Professional Certification",
  "Other Educational Expenses",
]

export default function LoanReasonForm() {
  const router = useRouter()
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Here you would typically save the reason to your application state or backend
    // For now, we'll just simulate a delay and redirect
    await new Promise((resolve) => setTimeout(resolve, 1000))

    router.push("/dashboard/loan-application")
  }

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
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-emerald-600">Loan Application</CardTitle>
            <p className="text-sm text-gray-600">Please tell us why you need this loan</p>
          </CardHeader>
          <motion.form onSubmit={handleSubmit} variants={formVariants}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-gray-700">
                  Primary Reason for Loan
                </Label>
                <Select required onValueChange={setReason}>
                  <SelectTrigger id="reason" className="border-emerald-200 focus:ring-emerald-500">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {loanReasons.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="text-gray-700">
                    Detailed Description
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0">
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Provide specific details about how this loan will support your education.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  id="description"
                  placeholder="Please provide more details about why you need this loan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] border-emerald-200 focus:ring-emerald-500"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Continue to Application"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </motion.form>
        </Card>
      </motion.div>
    </div>
  )
}

