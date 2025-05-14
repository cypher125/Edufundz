"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { loanApi, walletApi } from "@/lib/api"

export default function TransactionHistory() {
  const [filter, setFilter] = useState("all")
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch loan-related transactions
        const loans = await loanApi.getLoans()
        const repayments = await loanApi.getRepayments()
        
        // Fetch wallet transactions
        const walletTransactions = await walletApi.getTransactions()
        
        // Format loans as transactions
        const loanTransactions = Array.isArray(loans) ? 
          loans.map(loan => ({
            id: `loan-${loan.id}`,
            type: "loan",
            amount: Number(loan.amount),
            date: loan.disbursed_date || loan.created_at,
            status: loan.status
          })) : []
        
        // Format repayments as transactions
        const repaymentTransactions = Array.isArray(repayments) ?
          repayments.map(repayment => ({
            id: `repayment-${repayment.id}`,
            type: "repayment",
            amount: -Number(repayment.amount),
            date: repayment.payment_date || repayment.due_date,
            status: repayment.status
          })) : []
        
        // Format wallet transactions
        const formattedWalletTransactions = Array.isArray(walletTransactions) ?
          walletTransactions.map(txn => ({
            id: `wallet-${txn.id}`,
            type: txn.transaction_type,
            amount: txn.transaction_type === 'deposit' ? 
              Number(txn.amount) : -Number(txn.amount),
            date: txn.created_at,
            status: txn.status
          })) : []
        
        // Combine all transactions
        const allTransactions = [
          ...loanTransactions,
          ...repaymentTransactions,
          ...formattedWalletTransactions
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        
        setTransactions(allTransactions)
      } catch (err) {
        console.error("Error fetching transactions:", err)
        setError("Failed to load transactions")
      } finally {
        setLoading(false)
      }
    }
    
    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true
    return transaction.status === filter
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <motion.div
        className="max-w-2xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-800">Transaction History</CardTitle>
            <Select onValueChange={setFilter} defaultValue={filter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No transactions found</div>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  className="flex justify-between items-center border-b pb-2"
                  variants={itemVariants}
                >
                  <div className="flex items-center space-x-2">
                    {transaction.amount > 0 ? (
                      <ArrowDown className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowUp className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </p>
                      <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.amount > 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {transaction.amount > 0 ? "+" : ""}₦{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className={`text-sm ${transaction.status === "approved" ? "text-emerald-500" : "text-amber-500"}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

