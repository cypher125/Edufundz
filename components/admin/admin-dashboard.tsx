"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, CreditCard, TrendingUp, AlertCircle, Check, X, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { toast } from "@/components/ui/use-toast"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [loans, setLoans] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState([])
  const [chartData, setChartData] = useState([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch loan applications
        const applicationsRes = await fetch('/api/admin/loan-applications')
        const applicationsData = await applicationsRes.json()
        
        // Fetch loans
        const loansRes = await fetch('/api/admin/loans')
        const loansData = await loansRes.json()
        
        // Fetch users
        const usersRes = await fetch('/api/admin/users')
        const usersData = await usersRes.json()
        
        // Fetch loan stats
        const statsRes = await fetch('/api/admin/loans/stats')
        const statsData = await statsRes.json()
        
        setApplications(applicationsData)
        setLoans(loansData)
        setUsers(usersData)
        
        // Calculate statistics
        const totalUsers = usersData.length
        const activeLoans = loansData.filter(loan => loan.status === 'active').length
        const totalLoanAmount = loansData
          .filter(loan => loan.status === 'active')
          .reduce((sum, loan) => sum + loan.amount, 0)
        
        const paidLoans = loansData.filter(loan => loan.status === 'paid').length
        const defaultedLoans = loansData.filter(loan => loan.status === 'defaulted').length
        const totalLoans = loansData.length
        
        const repaymentRate = totalLoans > 0 ? ((paidLoans / totalLoans) * 100).toFixed(1) : 0
        const defaultRate = totalLoans > 0 ? ((defaultedLoans / totalLoans) * 100).toFixed(1) : 0
        
        setStats([
          {
            title: "Total Users",
            value: totalUsers.toString(),
            change: "+12%", // This would ideally be calculated from historical data
            trend: "up",
            icon: Users,
          },
          {
            title: "Active Loans",
            value: `₦${(totalLoanAmount / 1000000).toFixed(1)}M`,
            change: "+25%", // This would ideally be calculated from historical data
            trend: "up",
            icon: CreditCard,
          },
          {
            title: "Repayment Rate",
            value: `${repaymentRate}%`,
            change: "-2%", // This would ideally be calculated from historical data
            trend: "down",
            icon: TrendingUp,
          },
          {
            title: "Default Rate",
            value: `${defaultRate}%`,
            change: "+1%", // This would ideally be calculated from historical data
            trend: "up",
            icon: AlertCircle,
          },
        ])
        
        // Generate chart data
        setChartData(getChartData(loansData))
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive",
        })
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Generate chart data from loans grouped by month
  const getChartData = (loans) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthlyData = {}
    
    // Initialize all months with zero
    monthNames.forEach(month => {
      monthlyData[month] = 0
    })
    
    // Sum loan amounts by month
    loans.forEach(loan => {
      const date = new Date(loan.created_at)
      const month = monthNames[date.getMonth()]
      monthlyData[month] += loan.amount
    })
    
    // Convert to array format for chart
    return Object.keys(monthlyData).map(month => ({
      month,
      amount: monthlyData[month]
    }))
  }
  
  const handleApprove = async (applicationId) => {
    try {
      const response = await fetch(`/api/admin/loan-applications/${applicationId}/approve`, {
        method: 'POST',
      })
      
      if (response.ok) {
        // Update application status locally
        setApplications(applications.map(app => 
          app.id === applicationId ? { ...app, status: 'approved' } : app
        ))
        
        toast({
          title: "Success",
          description: "Application approved successfully",
        })
      } else {
        throw new Error("Failed to approve application")
      }
    } catch (error) {
      console.error("Error approving application:", error)
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive",
      })
    }
  }
  
  const handleReject = async (applicationId) => {
    try {
      const response = await fetch(`/api/admin/loan-applications/${applicationId}/reject`, {
        method: 'POST',
      })
      
      if (response.ok) {
        // Update application status locally
        setApplications(applications.map(app => 
          app.id === applicationId ? { ...app, status: 'rejected' } : app
        ))
        
        toast({
          title: "Success",
          description: "Application rejected successfully",
        })
      } else {
        throw new Error("Failed to reject application")
      }
    } catch (error) {
      console.error("Error rejecting application:", error)
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive",
      })
    }
  }
  
  // Filter applications based on the selected filter
  const filteredApplications = applications.filter(app => 
    filter === "all" ? true : app.status === filter
  )

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">EDUFUNDZ Dashboard Overview</h1>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Generate Report</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <stat.icon className="h-8 w-8 text-emerald-600" />
                        <span
                          className={`text-sm font-medium flex items-center ${
                            stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {stat.trend === "up" ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                          )}
                          {stat.change}
                        </span>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Disbursement Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="amount" stroke="#059669" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Applications</CardTitle>
                  <Select defaultValue="all" onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApplications.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              No applications found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredApplications.map((application) => (
                            <TableRow key={application.id}>
                              <TableCell>{application.user?.full_name || application.user?.email || "Unknown"}</TableCell>
                              <TableCell>₦{application.amount?.toLocaleString() || 0}</TableCell>
                              <TableCell>{application.purpose || "Not specified"}</TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    application.status === "approved"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : application.status === "rejected"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || "Unknown"}
                                </span>
                              </TableCell>
                              <TableCell>
                                {application.status === "pending" && (
                                  <div className="flex space-x-2">
                                    <Button 
                                      size="sm" 
                                      className="bg-emerald-500 hover:bg-emerald-600"
                                      onClick={() => handleApprove(application.id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      className="bg-red-500 hover:bg-red-600"
                                      onClick={() => handleReject(application.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

