"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const loanRequests = [
  { id: 1, name: "John Doe", amount: 50000, status: "pending" },
  { id: 2, name: "Jane Smith", amount: 75000, status: "pending" },
  { id: 3, name: "Bob Johnson", amount: 100000, status: "pending" },
]

export default function AdminPanel() {
  const [requests, setRequests] = useState(loanRequests)

  const handleApprove = (id: number) => {
    setRequests(requests.map((req) => (req.id === id ? { ...req, status: "approved" } : req)))
  }

  const handleReject = (id: number) => {
    setRequests(requests.map((req) => (req.id === id ? { ...req, status: "rejected" } : req)))
  }

  return (
    <div className="min-h-screen bg-[#F4FFC3] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#5D8736]">Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Loan Requests</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>₦{request.amount.toLocaleString()}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleApprove(request.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#5D8736]">Loan Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Disbursed:</span>
              <span className="font-medium">₦5,000,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Repayments:</span>
              <span className="font-medium">₦3,500,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Loans:</span>
              <span className="font-medium">150</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Defaulters:</span>
              <span className="font-medium text-red-500">10</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

