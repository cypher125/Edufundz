'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LoanApprovalStatus from "@/components/loan-approval-status"
import { loanApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function LoanStatusPage() {
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const data = await loanApi.getApplications()
        setApplications(data)
      } catch (error: any) {
        console.error("Failed to fetch loan applications:", error)
        setError("Failed to load your loan applications")
        toast({
          title: "Error",
          description: "Failed to retrieve your loan applications. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          onClick={() => router.refresh()}
        >
          Try Again
        </button>
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">No Loan Applications</h1>
        <p className="text-gray-600 mb-6">You haven't submitted any loan applications yet.</p>
        <button
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          onClick={() => router.push('/dashboard/loan-application')}
        >
          Apply for a Loan
        </button>
      </div>
    )
  }

  // Sort applications by creation date (newest first)
  const sortedApplications = [...applications].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  // Get the most recent application to display its status
  const latestApplication = sortedApplications[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Loan Applications</h1>
      
      {/* Display the latest application status prominently */}
      <div className="mb-8">
        <LoanApprovalStatus 
          status={latestApplication.status} 
          reason={latestApplication.rejection_reason}
          applicationData={latestApplication}
        />
      </div>
      
      {/* If there are multiple applications, show history */}
      {applications.length > 1 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Application History</h2>
          <div className="space-y-4">
            {sortedApplications.slice(1).map((application) => (
              <div 
                key={application.id} 
                className="p-4 border rounded-lg bg-white shadow-sm"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Application #{application.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(application.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      Amount: ₦{Number(application.amount).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      Purpose: {application.reason}
                    </p>
                  </div>
                  <div>
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        application.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : application.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

