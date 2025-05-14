"use client"

import { motion } from "framer-motion"
import { CheckCircle, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoanSubmissionSuccess() {
  const router = useRouter()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
              className="flex justify-center"
            >
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-center text-emerald-600 mt-4">
              Loan Application Submitted!
            </CardTitle>
          </CardHeader>
          <motion.div variants={contentVariants}>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Your loan application has been successfully submitted. We will review your application and get back to
                you shortly.
              </p>
              <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-emerald-700 mb-2">Next Steps:</h3>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  <li>Review of your application (1-2 business days)</li>
                  <li>Verification of provided information</li>
                  <li>Decision notification via email</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => router.push("/dashboard/loan-status")}
              >
                Check Loan Status
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                onClick={() => router.push("/dashboard")}
              >
                Return to Dashboard
              </Button>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}

