"use client"

import { motion } from "framer-motion"
import { User, Mail, Phone, School, Calendar, FileText, Clock, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// In a real app, this would be fetched from an API
const userData = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+234 123 456 7890",
  matricNo: "YCT/21/0123",
  department: "Computer Science",
  level: "300",
  joinDate: "2023-08-15",
  status: "active",
  totalLoans: 2,
  totalAmount: 150000,
  repaidAmount: 75000,
  documents: [
    { name: "Student ID", type: "image/jpeg", size: "2.4 MB", status: "verified" },
    { name: "School Fee Receipt", type: "application/pdf", size: "1.2 MB", status: "verified" },
    { name: "Guarantor Form", type: "application/pdf", size: "890 KB", status: "pending" },
  ],
  loanHistory: [
    {
      id: 1,
      amount: 50000,
      purpose: "Tuition Fees",
      status: "completed",
      dateTaken: "2023-05-15",
      dueDate: "2023-11-15",
    },
    {
      id: 2,
      amount: 100000,
      purpose: "Project Research",
      status: "active",
      dateTaken: "2023-08-01",
      dueDate: "2024-02-01",
    },
  ],
  activityLog: [
    { action: "Updated profile picture", date: "2023-08-15 14:30" },
    { action: "Submitted new loan application", date: "2023-08-01 09:15" },
    { action: "Completed loan repayment", date: "2023-07-15 16:45" },
    { action: "Updated contact information", date: "2023-07-01 11:20" },
  ],
}

export default function UserDetailPage() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-gray-800"
          >
            User Profile
          </motion.h1>
          <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
            <Download className="mr-2 h-4 w-4" />
            Export Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">{userData.name}</p>
                    <p className="text-sm text-gray-500">{userData.matricNo}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{userData.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{userData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <School className="h-4 w-4" />
                    <span className="text-sm">{userData.department}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Joined {new Date(userData.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {doc.type} • {doc.size}
                          </p>
                        </div>
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
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="loans" className="space-y-4">
              <TabsList>
                <TabsTrigger value="loans">Loan History</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>

              <TabsContent value="loans">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Loan Overview</CardTitle>
                      <div className="flex space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Loans</p>
                          <p className="font-medium">{userData.totalLoans}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="font-medium">₦{userData.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Repayment Progress</span>
                        <span className="text-emerald-600">
                          {((userData.repaidAmount / userData.totalAmount) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={(userData.repaidAmount / userData.totalAmount) * 100}
                        className="h-2"
                        indicatorClassName="bg-emerald-500"
                      />
                    </div>

                    <div className="space-y-4">
                      {userData.loanHistory.map((loan) => (
                        <div key={loan.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-medium">₦{loan.amount.toLocaleString()}</h4>
                              <p className="text-sm text-gray-500">{loan.purpose}</p>
                            </div>
                            <Badge
                              variant={loan.status === "completed" ? "default" : "secondary"}
                              className={
                                loan.status === "completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {loan.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Taken: {new Date(loan.dateTaken).toLocaleDateString()}</span>
                            <span>Due: {new Date(loan.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userData.activityLog.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="mt-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="flex-1 border-b pb-4">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

