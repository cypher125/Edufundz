"use client"

import { motion } from "framer-motion"
import { Bell, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useState, useEffect } from "react"
import { loanApi, walletApi } from "@/lib/api"

export default function Dashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [loanData, setLoanData] = useState<any>(null)
  const [repayments, setRepayments] = useState<any[]>([])
  const [nextPayment, setNextPayment] = useState<any>(null)
  
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true)
        
        // Fetch the user's loans
        const loansResponse = await loanApi.getLoans()
        const activeLoans = Array.isArray(loansResponse) ? 
          loansResponse.filter(loan => loan.status === 'active') : []
        
        if (activeLoans.length > 0) {
          setLoanData(activeLoans[0]) // Use the first active loan
          
          // Get repayments for this loan
          const repaymentsResponse = await loanApi.getRepayments()
          const loanRepayments = Array.isArray(repaymentsResponse) ?
            repaymentsResponse.filter(rep => rep.loan === activeLoans[0].id) : []
          
          setRepayments(loanRepayments)
          
          // Find the next upcoming payment
          const pendingPayments = loanRepayments.filter(rep => 
            rep.status === 'pending'
          ).sort((a, b) => 
            new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
          )
          
          if (pendingPayments.length > 0) {
            setNextPayment(pendingPayments[0])
          }
        }
      } catch (error) {
        console.error("Error fetching loan data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [])
  
  // Calculate loan progress if we have loan data
  const calculateProgress = () => {
    if (!loanData || !repayments.length) return 0
    
    const paidRepayments = repayments.filter(rep => rep.status === 'paid')
    return Math.round((paidRepayments.length / repayments.length) * 100)
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <motion.h1 initial={{ x: -20 }} animate={{ x: 0 }} className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.username || 'User'}!
        </motion.h1>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-gray-600" />
        </Button>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Loan Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-100 rounded-full p-3">
                <User className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.username || 'User'}</p>
                <p className="text-sm text-gray-500">
                  {user?.email && `Email: ${user.email}`}
                </p>
              </div>
            </div>
            {loanData ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Loan Status</span>
                  <span className="text-sm font-medium text-emerald-600">{loanData.status.charAt(0).toUpperCase() + loanData.status.slice(1)}</span>
                </div>
                <Progress value={calculateProgress()} className="h-2 bg-gray-200" indicatorClassName="bg-emerald-600" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Loan Status</span>
                  <span className="text-sm font-medium text-gray-500">No active loans</span>
                </div>
                <Progress value={0} className="h-2 bg-gray-200" indicatorClassName="bg-emerald-600" />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Loan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loanData ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount Borrowed</span>
                    <span className="font-medium text-gray-800">₦{Number(loanData.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Repayment Due</span>
                    <span className="font-medium text-gray-800">₦{nextPayment ? Number(nextPayment.amount).toLocaleString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Next Payment</span>
                    <span className="font-medium text-gray-800">{nextPayment ? formatDate(nextPayment.due_date) : 'N/A'}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No active loans</p>
                  <p className="text-sm text-gray-400 mt-1">Apply for a loan to see details here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => router.push("/dashboard/loan-reason")}
              >
                Request New Loan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                onClick={() => router.push("/dashboard/repayment")}
                disabled={!loanData}
              >
                Make a Repayment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

