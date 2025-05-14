"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Download, DollarSign, Calendar, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data - In a real app, this would come from an API
const disbursements = [
  {
    id: 1,
    student: "John Doe",
    matricNo: "YCT/21/0123",
    amount: 50000,
    date: "2023-08-15",
    status: "completed",
    bank: "GTBank",
    accountNo: "0123456789",
  },
  {
    id: 2,
    student: "Jane Smith",
    matricNo: "YCT/21/0124",
    amount: 75000,
    date: "2023-08-14",
    status: "pending",
    bank: "Access Bank",
    accountNo: "0123456790",
  },
  {
    id: 3,
    student: "Bob Johnson",
    matricNo: "YCT/21/0125",
    amount: 100000,
    date: "2023-08-13",
    status: "failed",
    bank: "First Bank",
    accountNo: "0123456791",
  },
]

export default function DisbursementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredDisbursements = disbursements.filter((disbursement) => {
    const matchesSearch =
      disbursement.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disbursement.matricNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || disbursement.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalDisbursed = disbursements.reduce((sum, d) => sum + d.amount, 0)
  const pendingDisbursements = disbursements.filter((d) => d.status === "pending").length
  const successRate = (disbursements.filter((d) => d.status === "completed").length / disbursements.length) * 100

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Disbursements</h1>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-emerald-50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-emerald-700">Total Disbursed</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-700" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700">₦{totalDisbursed.toLocaleString()}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-yellow-50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-yellow-700">Pending</CardTitle>
                  <Calendar className="h-4 w-4 text-yellow-700" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-700">{pendingDisbursements}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-blue-50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-blue-700">Success Rate</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-blue-700" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">{successRate.toFixed(1)}%</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Disbursement Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name or matric number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Matric No.</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Account No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDisbursements.map((disbursement) => (
                    <TableRow key={disbursement.id}>
                      <TableCell className="font-medium">{disbursement.student}</TableCell>
                      <TableCell>{disbursement.matricNo}</TableCell>
                      <TableCell>₦{disbursement.amount.toLocaleString()}</TableCell>
                      <TableCell>{disbursement.bank}</TableCell>
                      <TableCell>{disbursement.accountNo}</TableCell>
                      <TableCell>{new Date(disbursement.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            disbursement.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : disbursement.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {disbursement.status.charAt(0).toUpperCase() + disbursement.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

