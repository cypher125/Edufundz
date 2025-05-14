"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, CreditCard, DollarSign, AlertCircle, ArrowRight, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { loanApi, walletApi } from "@/lib/api"
import VirtualAccount from "./wallet/VirtualAccount"

interface RepaymentProps {
  loan: any;
  repayments: any[];
}

export default function RepaymentPage({ loan, repayments }: RepaymentProps) {
  const [autoRepayment, setAutoRepayment] = useState(false)
  const [repaymentAmount, setRepaymentAmount] = useState("")
  const [balance, setBalance] = useState<number>(0)
  const [processing, setProcessing] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [fetchingWallet, setFetchingWallet] = useState(false)
  const [fetchingLoanData, setFetchingLoanData] = useState(false)
  const [loanSchedule, setLoanSchedule] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Fetch loan details, schedule and wallet balance
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingWallet(true)
        setFetchingLoanData(true)
        
        // Fetch wallet balance
        try {
        const wallet = await walletApi.getWallet()
        setWalletBalance(Number(wallet.balance))
        } catch (err) {
          console.error("Failed to fetch wallet:", err)
          // Don't set error to allow other operations to continue
        }
        
        if (loan?.id) {
          try {
          // Fetch loan schedule
          const schedule = await loanApi.getLoanSchedule(loan.id)
          setLoanSchedule(schedule)
          
          // Fetch remaining balance
          const balanceData = await loanApi.getRemainingBalance(loan.id)
          setBalance(Number(balanceData.remaining_balance))
          } catch (err) {
            console.error("Failed to fetch loan data:", err)
            const errorMessage = err.toString();
            if (errorMessage.includes('no such table')) {
              toast({
                title: "Database Error",
                description: "The loan database tables haven't been created yet. Please run migrations.",
                variant: "destructive",
                duration: 5000,
              });
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast({
          title: "Error",
          description: "Failed to load repayment data.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setFetchingWallet(false)
        setFetchingLoanData(false)
      }
    }

    fetchData()
  }, [loan, toast])

  const handleRepayment = async () => {
    if (!repaymentAmount || Number(repaymentAmount) <= 0) {
      toast({
        title: "Repayment Failed",
        description: "Please enter a valid repayment amount.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    // Find the next pending repayment - either from fetched schedule or passed repayments
    const nextRepayment = loanSchedule.length > 0 
      ? loanSchedule.find(r => r.status === 'pending')
      : repayments
          .filter(r => r.status === 'pending')
          .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0]

    if (!nextRepayment) {
      toast({
        title: "No Pending Repayments",
        description: "There are no pending repayments to process.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    const amount = Number(repaymentAmount)

    // Check if wallet has enough balance
    if (amount > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Your wallet balance is insufficient for this repayment.",
        variant: "destructive",
        duration: 5000,
      })
      
      // Redirect to wallet funding page
      if (confirm("Would you like to top up your wallet?")) {
        router.push('/dashboard/wallet')
      }
      return
    }

    try {
      setProcessing(true)
      
      // Process the repayment
      const result = await loanApi.makeRepayment(nextRepayment.id.toString())
      
      toast({
        title: "Repayment Successful",
        description: `₦${amount.toLocaleString()} has been repaid.`,
        duration: 5000,
      })
      
      setRepaymentAmount("")
      
      // Refresh data after repayment
      if (loan?.id) {
        const balanceData = await loanApi.getRemainingBalance(loan.id)
        setBalance(Number(balanceData.remaining_balance))
        
        const schedule = await loanApi.getLoanSchedule(loan.id)
        setLoanSchedule(schedule)
      }
      
      // Refresh wallet balance
      const wallet = await walletApi.getWallet()
      setWalletBalance(Number(wallet.balance))
    } catch (error: any) {
      console.error("Repayment error:", error)
      toast({
        title: "Repayment Failed",
        description: error.data?.detail || "Failed to process your repayment. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setProcessing(false)
    }
  }

  // Calculate repayment progress
  const calculateProgress = () => {
    if (!loan || balance === 0) return 0
    const totalAmount = Number(loan.amount)
    const amountPaid = totalAmount - balance
    return Math.round((amountPaid / totalAmount) * 100)
  }

  // Find the next due repayment
  const getNextDueDate = () => {
    // Use the fetched schedule if available
    if (loanSchedule && loanSchedule.length > 0) {
      const pendingRepayments = loanSchedule
        .filter(r => r.status === 'pending')
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      
      return pendingRepayments.length > 0 ? pendingRepayments[0].due_date : null
    }
    
    // Fallback to passed repayments
    if (!repayments || repayments.length === 0) return null
    
    const pendingRepayments = repayments
      .filter(r => r.status === 'pending')
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    
    return pendingRepayments.length > 0 ? pendingRepayments[0].due_date : null
  }

  // Format date to be more readable
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No date'
    
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get repayment history - preferably from the schedule
  const getRepaymentHistory = () => {
    if (loanSchedule && loanSchedule.length > 0) {
      return [...loanSchedule]
        .filter(r => r.status === 'paid')
        .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
        .slice(0, 5) // Show only 5 most recent
    }
    
    // Fallback to passed repayments
    return [...repayments]
      .filter(r => r.status === 'paid')
      .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
      .slice(0, 5) // Show only 5 most recent
  }

  const nextDueDate = getNextDueDate()
  const progress = calculateProgress()
  const repaymentHistory = getRepaymentHistory()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (fetchingLoanData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 mt-2">Loading loan details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.h1 className="text-3xl font-bold text-emerald-600 mb-6">
            Loan Repayment
          </motion.h1>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-amber-800">
            <h2 className="text-xl font-semibold mb-2">Unable to Load Loan Data</h2>
            <p className="mb-4">{error}</p>
            
            <div className="mt-6 flex gap-4">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
              
              <Button 
                onClick={() => router.push('/dashboard')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
          
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold text-emerald-700">Other Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Fund Your Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Add funds to your wallet to make repayments easier</p>
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => router.push('/dashboard/wallet')}
                  >
                    Go to Wallet
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Apply for a Loan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Need financial support for your education?</p>
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => router.push('/dashboard/loan-application')}
                  >
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-emerald-700 mb-4">Create a Virtual Account</h2>
              <p className="text-gray-600 mb-6">
                Set up a dedicated account for loan repayments. Funds sent to this account will automatically be applied to your loans.
              </p>
              <VirtualAccount />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <motion.div
        className="max-w-4xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="text-3xl font-bold text-emerald-600 mb-6">
          Loan Repayment
        </motion.h1>

        <motion.div variants={itemVariants}>
          <Card className="bg-white shadow-lg border-emerald-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-emerald-600">Repayment Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Loan Amount:</span>
                <span className="font-medium text-gray-800">₦{Number(loan.amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount Repaid:</span>
                <span className="font-medium text-gray-800">₦{(Number(loan.amount) - balance).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Remaining Balance:</span>
                <span className="font-medium text-gray-800">₦{balance.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Repayment Progress</span>
                  <span className="text-sm font-medium text-emerald-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" indicatorClassName="bg-emerald-500" />
              </div>
              <div className="flex items-center space-x-2 text-amber-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {nextDueDate 
                    ? `Next payment due: ${formatDate(nextDueDate)}` 
                    : "No pending repayments"}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white shadow-lg border-emerald-100">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-emerald-600">Make a Repayment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="repayment-amount">Repayment Amount (₦)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="repayment-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={repaymentAmount}
                    onChange={(e) => setRepaymentAmount(e.target.value)}
                    className="pl-10"
                    disabled={processing || !nextDueDate}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-emerald-500" />
                  <span className="text-gray-600">Wallet Balance:</span>
                </div>
                {fetchingWallet ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="font-medium text-gray-800">₦{walletBalance.toLocaleString()}</span>
                )}
              </div>
              {walletBalance <= 0 && (
                <div className="text-sm text-red-500">
                  Your wallet balance is low. Please top up to make repayments.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" 
                onClick={handleRepayment}
                disabled={processing || !repaymentAmount || !nextDueDate || Number(repaymentAmount) <= 0}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                Make Repayment
                <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/wallet')}
              >
                Top Up Wallet
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white shadow-lg border-emerald-100">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-emerald-600">Automated Repayments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-repayment">Enable Auto-Repayment</Label>
                  <p className="text-sm text-gray-500">Automatically repay on the due date</p>
                </div>
                <Switch
                  id="auto-repayment"
                  checked={autoRepayment}
                  onCheckedChange={setAutoRepayment}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
              {autoRepayment && nextDueDate && (
                <div className="space-y-2">
                  <Label htmlFor="repayment-date">Next Repayment Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="repayment-date" 
                      type="date" 
                      defaultValue={nextDueDate ? new Date(nextDueDate).toISOString().split('T')[0] : ''} 
                      className="pl-10" 
                      disabled
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {repaymentHistory.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="bg-white shadow-lg border-emerald-100">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-emerald-600">Repayment History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {repaymentHistory.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600">{formatDate(payment.payment_date)}</span>
                    <span className="font-medium text-emerald-600">₦{Number(payment.amount).toLocaleString()}</span>
                </div>
              ))}
                {repaymentHistory.length === 0 && (
                  <p className="text-center text-gray-500">No repayment history yet.</p>
                )}
            </CardContent>
              {loanSchedule.filter(r => r.status === 'paid').length > 5 && (
            <CardFooter>
              <Button variant="link" className="w-full text-emerald-600">
                View Full History
              </Button>
            </CardFooter>
              )}
          </Card>
        </motion.div>
        )}

        <motion.div variants={itemVariants} className="mt-8">
          <h2 className="text-xl font-semibold text-emerald-700 mb-4">Virtual Account for Repayments</h2>
          <p className="text-gray-600 mb-6">
            Set up a dedicated account for easy loan repayments. Funds sent to this account will automatically be applied to your loans.
          </p>
          <VirtualAccount />
        </motion.div>
      </motion.div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="fixed bottom-20 right-4 rounded-full shadow-lg">
              <AlertCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Need help with repayments? Contact support.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

