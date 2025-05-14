"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  User,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Mail,
  Phone,
  School,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useParams } from "next/navigation"

export default function ApplicationDetailPage() {
  const params = useParams()
  const applicationId = params.id
  
  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState(null)
  const [reviewNote, setReviewNote] = useState("")
  
  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setLoading(true)
        
        // Fetch application details
        const response = await fetch(`/api/admin/loan-applications/${applicationId}`)
        
        if (!response.ok) {
          throw new Error(`Error fetching application: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Fetch user details
        const userResponse = await fetch(`/api/admin/users/${data.user_id}`)
        const userData = await userResponse.json()
        
        // Combine the data
        setApplication({
          id: data.id,
          status: data.status,
          submittedDate: data.created_at,
          applicant: {
            name: userData.full_name || `${userData.first_name || ''} ${userData.last_name || ''}`,
            matricNo: userData.matric_number || 'N/A',
            department: userData.department || 'N/A',
            level: userData.level || 'N/A',
            email: userData.email,
            phone: userData.phone_number || 'N/A',
          },
          loanDetails: {
            amount: data.amount,
            purpose: data.purpose,
            duration: data.duration || 6,
            monthlyRepayment: data.monthly_repayment || Math.round(data.amount / (data.duration || 6)),
            totalRepayment: data.total_repayment || Math.round(data.amount * 1.08),
          },
          documents: data.documents || [
            { name: "Student ID Card", status: data.id_verified ? "verified" : "pending" },
            { name: "School Fee Receipt", status: data.fee_receipt_verified ? "verified" : "pending" },
            { name: "Project Proposal", status: data.proposal_verified ? "verified" : "pending" },
            { name: "Guarantor Form", status: data.guarantor_verified ? "verified" : "pending" },
          ],
          timeline: data.timeline || [
            { status: "submitted", date: new Date(data.created_at).toLocaleString(), message: "Application submitted" },
            ...(data.updated_at !== data.created_at ? [
              { status: "updated", date: new Date(data.updated_at).toLocaleString(), message: "Application updated" }
            ] : [])
          ],
        })
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching application data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch application details",
          variant: "destructive",
        })
        setLoading(false)
      }
    }
    
    if (applicationId) {
      fetchApplicationData()
    }
  }, [applicationId])
  
  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/admin/loan-applications/${applicationId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review_note: reviewNote }),
      })
      
      if (!response.ok) {
        throw new Error(`Error approving application: ${response.status}`)
      }
      
      // Update application status locally
      setApplication(prev => ({ ...prev, status: 'approved' }))
      
      toast({
        title: "Success",
        description: "Application approved successfully",
      })
    } catch (error) {
      console.error("Error approving application:", error)
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive",
      })
    }
  }
  
  const handleReject = async () => {
    try {
      const response = await fetch(`/api/admin/loan-applications/${applicationId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review_note: reviewNote }),
      })
      
      if (!response.ok) {
        throw new Error(`Error rejecting application: ${response.status}`)
      }
      
      // Update application status locally
      setApplication(prev => ({ ...prev, status: 'rejected' }))
      
      toast({
        title: "Success",
        description: "Application rejected successfully",
      })
    } catch (error) {
      console.error("Error rejecting application:", error)
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive",
      })
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }
  
  if (!application) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Application Not Found</h2>
              <p className="text-gray-500 mb-6">The requested application could not be found or you don't have permission to view it.</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-gray-800"
            >
              Loan Application Details
            </motion.h1>
            <p className="text-gray-500">Application ID: {application.id}</p>
          </div>
          <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
            <Download className="mr-2 h-4 w-4" />
            Export Details
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Application Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-4">Loan Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Amount Requested:</span>
                          <span className="font-medium">₦{application.loanDetails.amount?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Purpose:</span>
                          <span className="font-medium">{application.loanDetails.purpose || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-medium">{application.loanDetails.duration} months</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Monthly Repayment:</span>
                          <span className="font-medium">
                            ₦{application.loanDetails.monthlyRepayment?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total Repayment:</span>
                          <span className="font-medium">
                            ₦{application.loanDetails.totalRepayment?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">Required Documents</h3>
                      <div className="space-y-3">
                        {application.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{doc.name}</span>
                            </div>
                            <Badge
                              variant={doc.status === "verified" ? "default" : "secondary"}
                              className={
                                doc.status === "verified"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {doc.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">Application Timeline</h3>
                    <div className="space-y-4">
                      {application.timeline.map((event, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="mt-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{event.message}</p>
                            <p className="text-xs text-gray-500">{event.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review & Decision</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Review Notes</Label>
                    <Textarea 
                      placeholder="Enter your review notes here..." 
                      className="min-h-[100px]"
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      disabled={application.status === 'approved' || application.status === 'rejected'}
                    />
                  </div>
                  {application.status === 'pending' && (
                    <div className="flex space-x-4">
                      <Button 
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleApprove}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve Application
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex-1"
                        onClick={handleReject}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Application
                      </Button>
                    </div>
                  )}
                  
                  {(application.status === 'approved' || application.status === 'rejected') && (
                    <div className="flex items-center justify-center p-3 bg-gray-50 rounded-md">
                      <p className="text-gray-500 text-sm">
                        This application has already been {application.status}. No further actions can be taken.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Applicant Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <User className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium">{application.applicant.name}</p>
                      <p className="text-sm text-gray-500">{application.applicant.matricNo}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <School className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{application.applicant.department}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Level {application.applicant.level}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{application.applicant.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{application.applicant.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Status</span>
                    <Badge
                      variant="secondary"
                      className={
                        application.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : application.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Submission Date</span>
                    <span className="text-sm">
                      {new Date(application.submittedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

