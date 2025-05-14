"use client"

import { motion } from "framer-motion"
import { CheckCircle, Clock, XCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

type StatusType = "pending" | "approved" | "rejected"

interface StatusProps {
  status: StatusType
  reason?: string
  applicationData?: any
}

const StatusIcon = ({ status }: { status: StatusType }) => {
  switch (status) {
    case "pending":
      return <Clock className="h-12 w-12 text-amber-500" />
    case "approved":
      return <CheckCircle className="h-12 w-12 text-emerald-500" />
    case "rejected":
      return <XCircle className="h-12 w-12 text-red-500" />
  }
}

const StatusMessage = ({ status, reason, applicationData }: StatusProps) => {
  // Format the date if available
  const formattedDate = applicationData?.created_at 
    ? new Date(applicationData.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      })
    : null;
    
  const amount = applicationData?.amount
    ? `₦${Number(applicationData.amount).toLocaleString()}`
    : null;

  switch (status) {
    case "pending":
      return (
        <>
          <h3 className="text-lg font-medium text-amber-500">Application Under Review</h3>
          <p className="text-sm text-gray-600">
            We're currently processing your application. This usually takes 1-2 business days.
          </p>
          {applicationData && (
            <div className="mt-4 p-3 bg-amber-50 rounded-md text-sm">
              <p className="font-medium text-amber-700">Application Details</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <p className="text-gray-600">Amount:</p>
                <p className="font-medium">{amount}</p>
                
                <p className="text-gray-600">Purpose:</p>
                <p className="font-medium">{applicationData.reason}</p>
                
                <p className="text-gray-600">Submitted:</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>
          )}
        </>
      )
    case "approved":
      return (
        <>
          <h3 className="text-lg font-medium text-emerald-500">Loan Approved!</h3>
          <p className="text-sm text-gray-600">
            Congratulations! Your loan has been approved. Funds will be disbursed shortly.
          </p>
          {applicationData && (
            <div className="mt-4 p-3 bg-emerald-50 rounded-md text-sm">
              <p className="font-medium text-emerald-700">Loan Details</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <p className="text-gray-600">Amount:</p>
                <p className="font-medium">{amount}</p>
                
                <p className="text-gray-600">Purpose:</p>
                <p className="font-medium">{applicationData.reason}</p>
                
                <p className="text-gray-600">Approved:</p>
                <p className="font-medium">{formattedDate}</p>
                
                {applicationData.loan && (
                  <>
                    <p className="text-gray-600">Monthly Payment:</p>
                    <p className="font-medium">₦{Number(applicationData.loan.monthly_payment).toLocaleString()}</p>
                    
                    <p className="text-gray-600">Interest Rate:</p>
                    <p className="font-medium">{applicationData.loan.interest_rate}%</p>
                    
                    <p className="text-gray-600">Term:</p>
                    <p className="font-medium">{applicationData.loan.term_months} months</p>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )
    case "rejected":
      return (
        <>
          <h3 className="text-lg font-medium text-red-500">Loan Application Rejected</h3>
          <p className="text-sm text-gray-600">We're sorry, but your loan application has been rejected.</p>
          {reason && <p className="mt-2 text-sm font-medium text-gray-700">Reason: {reason}</p>}
          {applicationData && (
            <div className="mt-4 p-3 bg-red-50 rounded-md text-sm">
              <p className="font-medium text-red-700">Application Details</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <p className="text-gray-600">Amount:</p>
                <p className="font-medium">{amount}</p>
                
                <p className="text-gray-600">Purpose:</p>
                <p className="font-medium">{applicationData.reason}</p>
                
                <p className="text-gray-600">Submitted:</p>
                <p className="font-medium">{formattedDate}</p>
                
                <p className="text-gray-600">Decision Date:</p>
                <p className="font-medium">{applicationData.updated_at ? new Date(applicationData.updated_at).toLocaleDateString() : "Unknown"}</p>
              </div>
            </div>
          )}
        </>
      )
  }
}

export default function LoanApprovalStatus({ status, reason, applicationData }: StatusProps) {
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
    <div className="w-full">
      <motion.div className="w-full" variants={containerVariants} initial="hidden" animate="visible">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">Loan Status</CardTitle>
          </CardHeader>
          <motion.div variants={contentVariants}>
            <CardContent className="space-y-4 text-center">
              <StatusIcon status={status} />
              <StatusMessage status={status} reason={reason} applicationData={applicationData} />
              <div className="flex justify-center space-x-2">
                {["pending", "approved", "rejected"].map((step, index) => (
                  <div
                    key={step}
                    className={`h-2 w-2 rounded-full ${
                      status === step
                        ? "bg-emerald-500"
                        : index < ["pending", "approved", "rejected"].indexOf(status)
                          ? "bg-emerald-200"
                          : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </motion.div>
          <CardFooter className="flex justify-center">
            {status === "rejected" && (
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Apply Again
              </Button>
            )}
            {status === "approved" && applicationData?.loan && (
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => router.push('/dashboard/repayment')}
              >
                View Repayment Schedule <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

