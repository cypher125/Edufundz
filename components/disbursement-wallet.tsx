"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowDown, ArrowUp, CreditCard, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function DisbursementWallet() {
  const [balance, setBalance] = useState(50000) // Example balance
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [bankName, setBankName] = useState("")
  const { toast } = useToast()

  const handleWithdraw = () => {
    const amount = Number.parseFloat(withdrawAmount)
    if (amount > 0 && amount <= balance && bankAccount && bankName) {
      setBalance(balance - amount)
      setWithdrawAmount("")
      setBankAccount("")
      setBankName("")
      toast({
        title: "Withdrawal Successful",
        description: `₦${amount.toLocaleString()} has been withdrawn to your bank account.`,
        duration: 5000,
      })
    } else {
      toast({
        title: "Withdrawal Failed",
        description: "Please check your withdrawal amount and bank details.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-[#F4FFC3] p-4 md:p-8">
      <motion.div
        className="max-w-4xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#5D8736]">Your Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Available Balance</p>
                <motion.p
                  className="text-4xl font-bold text-[#5D8736]"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  ₦{balance.toLocaleString()}
                </motion.p>
              </div>
              <div className="flex justify-center space-x-4">
                <Button className="flex items-center space-x-2 bg-[#5D8736] hover:bg-[#809D3C] text-white">
                  <ArrowDown className="h-4 w-4" />
                  <span>Deposit</span>
                </Button>
                <Button className="flex items-center space-x-2 bg-white border border-[#5D8736] text-[#5D8736] hover:bg-[#F4FFC3]">
                  <ArrowUp className="h-4 w-4" />
                  <span>Withdraw</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#5D8736]">Withdraw Funds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount to Withdraw (₦)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-name">Bank Name</Label>
                <Select onValueChange={setBankName} value={bankName}>
                  <SelectTrigger id="bank-name">
                    <SelectValue placeholder="Select your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="access">Access Bank</SelectItem>
                    <SelectItem value="gtb">Guaranty Trust Bank</SelectItem>
                    <SelectItem value="zenith">Zenith Bank</SelectItem>
                    {/* Add more banks as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-account">Bank Account Number</Label>
                <Input
                  id="bank-account"
                  type="text"
                  placeholder="Enter bank account number"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#5D8736] hover:bg-[#809D3C] text-white"
                onClick={handleWithdraw}
                disabled={!withdrawAmount || !bankAccount || !bankName}
              >
                Withdraw to Bank Account
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#5D8736]">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { type: "deposit", amount: 50000, date: "2023-07-15", status: "completed" },
                { type: "withdrawal", amount: -10000, date: "2023-07-20", status: "completed" },
                { type: "deposit", amount: 25000, date: "2023-08-01", status: "pending" },
              ].map((transaction, index) => (
                <motion.div
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    {transaction.amount > 0 ? (
                      <ArrowDown className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowUp className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </p>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                      {transaction.amount > 0 ? "+" : ""}₦{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p
                      className={`text-sm ${transaction.status === "completed" ? "text-green-500" : "text-yellow-500"}`}
                    >
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="link" className="w-full text-[#5D8736]">
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#5D8736]">Linked Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-6 w-6 text-[#5D8736]" />
                  <span>Visa ending in 1234</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This card is used for automatic repayments</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Manage Payment Methods
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

