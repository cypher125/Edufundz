"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Download, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export default function LoansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" })
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [loanStats, setLoanStats] = useState({
    totalLoans: 0,
    totalRepaid: 0,
    activeLoans: 0,
    defaultingLoans: 0
  })

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true)

        // Fetch loans
        const loansRes = await fetch('/api/admin/loans')
        
        if (!loansRes.ok) {
          throw new Error(`Error fetching loans: ${loansRes.status}`)
        }
        
        const loansData = await loansRes.json()
        
        // Fetch users to get names (if needed)
        const usersRes = await fetch('/api/admin/users')
        const usersData = await usersRes.json()
        
        // Create a map of user IDs to names
        const userMap = {}
        usersData.forEach(user => {
          userMap[user.id] = {
            name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`,
            matricNo: user.matric_number || 'N/A'
          }
        })
        
        // Combine loan data with user names
        const enhancedLoans = loansData.map(loan => ({
          ...loan,
          name: userMap[loan.user_id]?.name || 'Unknown',
          matricNo: userMap[loan.user_id]?.matricNo || 'N/A'
        }))
        
        setLoans(enhancedLoans)
        
        // Calculate statistics
        const totalAmount = enhancedLoans.reduce((sum, loan) => sum + loan.amount, 0)
        const totalRepaid = enhancedLoans.reduce((sum, loan) => sum + (loan.amount_paid || 0), 0)
        const active = enhancedLoans.filter(loan => loan.status === 'active').length
        const defaulting = enhancedLoans.filter(loan => loan.status === 'defaulting').length
        
        setLoanStats({
          totalLoans: totalAmount,
          totalRepaid: totalRepaid,
          activeLoans: active,
          defaultingLoans: defaulting
        })
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching loan data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch loan data",
          variant: "destructive",
        })
        setLoading(false)
      }
    }
    
    fetchLoans()
  }, [])

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  const filteredAndSortedLoans = loans
    .filter((loan) => {
      const matchesSearch =
        (loan.name && loan.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (loan.matricNo && loan.matricNo.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = statusFilter === "all" || loan.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortConfig.key === "amount" || sortConfig.key === "amount_paid") {
        return sortConfig.direction === "asc"
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key]
      }
      
      // Handle potential undefined values
      const valA = a[sortConfig.key] || ""
      const valB = b[sortConfig.key] || ""
      
      return sortConfig.direction === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA))
    })

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Loan Management</h1>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Total Loans",
                  value: `₦${loanStats.totalLoans.toLocaleString()}`,
                  className: "bg-emerald-50 text-emerald-700",
                },
                {
                  title: "Total Repaid",
                  value: `₦${loanStats.totalRepaid.toLocaleString()}`,
                  className: "bg-blue-50 text-blue-700",
                },
                {
                  title: "Active Loans",
                  value: loanStats.activeLoans,
                  className: "bg-yellow-50 text-yellow-700",
                },
                {
                  title: "Defaulting",
                  value: loanStats.defaultingLoans,
                  className: "bg-red-50 text-red-700",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={stat.className}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Loan Records</CardTitle>
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
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="defaulting">Defaulting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                          Name
                          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                        </TableHead>
                        <TableHead>Matric No.</TableHead>
                        <TableHead onClick={() => handleSort("amount")} className="cursor-pointer">
                          Amount
                          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                        </TableHead>
                        <TableHead onClick={() => handleSort("amount_paid")} className="cursor-pointer">
                          Amount Paid
                          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                        </TableHead>
                        <TableHead>Date Taken</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedLoans.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            No loans found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAndSortedLoans.map((loan) => (
                          <TableRow key={loan.id}>
                            <TableCell className="font-medium">
                              <Link
                                href={`/admin/loans/${loan.id}`}
                                className="text-emerald-600 hover:text-emerald-700 hover:underline"
                              >
                                {loan.name}
                              </Link>
                            </TableCell>
                            <TableCell>{loan.matricNo}</TableCell>
                            <TableCell>₦{loan.amount?.toLocaleString() || 0}</TableCell>
                            <TableCell>₦{loan.amount_paid?.toLocaleString() || 0}</TableCell>
                            <TableCell>{loan.created_at ? new Date(loan.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                            <TableCell>{loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'N/A'}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  loan.status === "active"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : loan.status === "paid"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {loan.status ? loan.status.charAt(0).toUpperCase() + loan.status.slice(1) : 'Unknown'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

