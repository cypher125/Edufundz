"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, CreditCard, TrendingUp, AlertCircle, Check, X, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { adminApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function AdminDashboard() {
  const [applications, setApplications] = useState<any[]>([])
  const [loans, setLoans] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [wallets, setWallets] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [filter, setFilter] = useState("all")
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeLoans: 0,
    repaymentRate: 0,
    defaultRate: 0,
  })
  const [chartData, setChartData] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all required data in parallel
        const [
          applicationsRes, 
          loansRes, 
          usersRes, 
          loanStatsRes,
          walletsRes,
          transactionsRes
        ] = await Promise.all([
          adminApi.getLoanApplications(),
          adminApi.getAdminLoans(),
          adminApi.getUsers(),
          adminApi.getLoanStats(),
          adminApi.getWallets(),
          adminApi.getTransactions()
        ])

        // Update state with fetched data
        setApplications(applicationsRes)
        setLoans(loansRes)
        setUsers(usersRes)
        setWallets(walletsRes)
        setTransactions(transactionsRes)

        // Calculate statistics
        const totalUsers = usersRes.length
        const activeLoans = loanStatsRes.active_loans || 0
        const paidLoans = loanStatsRes.paid_loans || 0
        const defaultedLoans = loanStatsRes.defaulted_loans || 0
        
        // Calculate repayment rate
        const repaymentRate = paidLoans + activeLoans > 0 
          ? Math.round((paidLoans / (paidLoans + activeLoans)) * 100) 
          : 0
        
        // Calculate default rate
        const defaultRate = paidLoans + activeLoans + defaultedLoans > 0
          ? Math.round((defaultedLoans / (paidLoans + activeLoans + defaultedLoans)) * 100)
          : 0

        setStats({
          totalUsers,
          activeLoans,
          repaymentRate,
          defaultRate
        })

        // Generate chart data from loans
        setChartData(getChartData(loansRes))
      } catch (error) {
        console.error("Error fetching admin data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Generate chart data from loans grouped by month
  const getChartData = (loans) => {
    const monthlyData = {}

    // Group loan amounts by month
    loans.forEach(loan => {
      const date = new Date(loan.disbursed_date)
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
      const monthDisplay = new Date(date.getFullYear(), date.getMonth(), 1)
        .toLocaleString('default', { month: 'short' })

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthDisplay,
          amount: 0
        }
      }

      monthlyData[monthKey].amount += Number(loan.amount)
    })

    // Convert to array and sort by month
    return Object.values(monthlyData)
      .sort((a, b) => new Date(a.month) - new Date(b.month))
  }

  const handleApprove = async (id: number) => {
    try {
      setProcessingId(id)
      
      await adminApi.approveLoanApplication(id, {
        interest_rate: 10.0, // 10% interest rate
        term_months: 12      // 12 month term
      })
      
      // Update the application in the UI
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: 'approved' } : app
      ))
      
      toast({
        title: "Success",
        description: `Loan application #${id} has been approved.`
      })
    } catch (error) {
      console.error("Error approving application:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve application. Please try again."
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: number) => {
    try {
      setProcessingId(id)
      
      await adminApi.rejectLoanApplication(id)
      
      // Update the application in the UI
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: 'rejected' } : app
      ))
      
      toast({
        title: "Success",
        description: `Loan application #${id} has been rejected.`
      })
    } catch (error) {
      console.error("Error rejecting application:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject application. Please try again."
      })
    } finally {
      setProcessingId(null)
    }
  }

  // Filter applications based on the selected filter
  const filteredApplications = applications.filter(application => {
    return filter === "all" || application.status === filter
  }).slice(0, 5) // Show only the most recent 5

  // Define dashboard stats
  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      change: "+12%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Loans",
      value: stats.activeLoans.toString(),
      change: "+25%",
      trend: "up",
      icon: CreditCard,
    },
    {
      title: "Repayment Rate",
      value: `${stats.repaymentRate}%`,
      change: "-2%",
      trend: "down",
      icon: TrendingUp,
    },
    {
      title: "Default Rate",
      value: `${stats.defaultRate}%`,
      change: "+1%",
      trend: "up",
      icon: AlertCircle,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">EDUFUNDZ Dashboard Overview</h1>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Generate Report</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
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
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No applications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>#{application.id}</TableCell>
                          <TableCell>{application.user?.email || application.user}</TableCell>
                          <TableCell>₦{Number(application.amount).toLocaleString()}</TableCell>
                          <TableCell>{application.reason}</TableCell>
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
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                            {application.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                  className="bg-emerald-500 hover:bg-emerald-600"
                                  onClick={() => handleApprove(application.id)}
                                  disabled={processingId === application.id}
                              >
                                  {processingId === application.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                <Check className="h-4 w-4" />
                                  )}
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleReject(application.id)}
                                  disabled={processingId === application.id}
                              >
                                  {processingId === application.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                <X className="h-4 w-4" />
                                  )}
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
      </div>
    </div>
  )
}

