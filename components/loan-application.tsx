"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Upload, HelpCircle, InfoIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { loanApi } from "@/lib/api"

export default function LoanApplication() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [loanAmount, setLoanAmount] = useState(5000)
  const [repaymentDuration, setRepaymentDuration] = useState(6)
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [bvn, setBvn] = useState("")
  const [purpose, setPurpose] = useState("")
  const [reasonDetails, setReasonDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const getInterestRate = () => {
    // Different interest rates based on loan duration
    if (repaymentDuration <= 3) return 0.05 // 5% for short term
    if (repaymentDuration <= 6) return 0.075 // 7.5% for medium term
    if (repaymentDuration <= 12) return 0.10 // 10% for 1 year
    return 0.125 // 12.5% for longer term
  }

  const calculateInterest = () => {
    const annualInterestRate = getInterestRate()
    const monthlyInterestRate = annualInterestRate / 12
    const totalInterest = loanAmount * monthlyInterestRate * repaymentDuration
    return totalInterest
  }

  const calculateMonthlyPayment = () => {
    const annualInterestRate = getInterestRate()
    const monthlyInterestRate = annualInterestRate / 12
    
    // For 0% interest loans
    if (monthlyInterestRate === 0) {
      return loanAmount / repaymentDuration
    }
    
    // Amortization formula: M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const monthlyPayment = 
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, repaymentDuration)) / 
      (Math.pow(1 + monthlyInterestRate, repaymentDuration) - 1)
    
    return Math.round(monthlyPayment * 100) / 100
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      // Prepare loan application data to send to backend API
      const applicationData = {
        amount: loanAmount,
        reason: purpose,
        reason_details: reasonDetails || `Loan for ${purpose} purposes. Duration: ${repaymentDuration} months.`,
        // We'll store bank details and student ID info when we make a real submission
        // We could store this in user metadata or a separate profile table in a real app
        metadata: {
          bank_name: bankName,
          account_number: accountNumber,
          bvn_last_four: bvn.slice(-4) // Only store last 4 digits for security
        }
      }
      
      // Send application data to backend
      const response = await loanApi.createApplication(applicationData)
      
      toast({
        title: "Application Submitted",
        description: "Your loan application has been submitted successfully and is pending review by an admin.",
        variant: "default",
      })
      
      // Redirect to success page
      router.push("/dashboard/loan-submission-success")
    } catch (error: any) {
      console.error("Loan application error:", error)
      
      toast({
        title: "Application Failed",
        description: error.data?.detail || "Failed to submit loan application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CardContent className="space-y-4">
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="loan-amount">Loan Amount (₦)</Label>
              <Slider
                id="loan-amount"
                min={1000}
                max={50000}
                step={1000}
                value={[loanAmount]}
                onValueChange={(value) => setLoanAmount(value[0])}
              />
              <div className="text-right font-medium text-emerald-600">₦{loanAmount.toLocaleString()}</div>
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="repayment-duration">Repayment Duration (months)</Label>
              <Select value={repaymentDuration.toString()} onValueChange={(value) => setRepaymentDuration(Number.parseInt(value))}>
                <SelectTrigger id="repayment-duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 months (5% interest)</SelectItem>
                  <SelectItem value="6">6 months (7.5% interest)</SelectItem>
                  <SelectItem value="12">12 months (10% interest)</SelectItem>
                  <SelectItem value="24">24 months (12.5% interest)</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="loan-purpose">Loan Purpose</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger id="loan-purpose">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tuition">Tuition Fees</SelectItem>
                  <SelectItem value="books">Books and Materials</SelectItem>
                  <SelectItem value="living">Living Expenses</SelectItem>
                  <SelectItem value="other">Other Education Expenses</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="reason-details">Additional Details</Label>
              <Input
                id="reason-details"
                value={reasonDetails}
                onChange={(e) => setReasonDetails(e.target.value)}
                placeholder="Briefly explain why you need this loan"
              />
            </motion.div>
            <motion.div className="pt-4 rounded-lg border p-4 bg-slate-50" variants={itemVariants}>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                <InfoIcon className="h-4 w-4 text-blue-500" />
                Loan Information
              </h3>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Interest Rate:</span>
                  <span className="font-medium text-emerald-600">{getInterestRate() * 100}% per annum</span>
                </div>
              <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Interest Amount:</span>
                <span className="font-medium text-emerald-600">₦{calculateInterest().toLocaleString()}</span>
              </div>
                <div className="flex justify-between items-center border-t pt-1 mt-1">
                  <span className="text-gray-600 text-sm">Monthly Payment:</span>
                  <span className="font-medium text-emerald-600">
                    ₦{calculateMonthlyPayment().toLocaleString()}
                  </span>
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Total Repayment:</span>
                <span className="font-medium text-emerald-600">
                    ₦{(calculateMonthlyPayment() * repaymentDuration).toLocaleString()}
                </span>
                </div>
              </div>
            </motion.div>
            <Alert variant="info" className="bg-blue-50 text-blue-700 text-xs">
              <AlertDescription>
                These rates are indicative. Your final approved rate may vary based on our assessment.
              </AlertDescription>
            </Alert>
          </CardContent>
        )
      case 2:
        return (
          <CardContent className="space-y-4">
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="bank-name">Bank Name</Label>
              <Select value={bankName} onValueChange={setBankName}>
                <SelectTrigger id="bank-name">
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="access">Access Bank</SelectItem>
                  <SelectItem value="gtb">Guaranty Trust Bank</SelectItem>
                  <SelectItem value="zenith">Zenith Bank</SelectItem>
                  <SelectItem value="first">First Bank</SelectItem>
                  <SelectItem value="uba">United Bank for Africa</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter your account number"
                maxLength={10}
              />
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <div className="flex items-center justify-between">
                <Label htmlFor="bvn">BVN (Bank Verification Number)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0">
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your 11-digit Bank Verification Number</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="bvn"
                value={bvn}
                onChange={(e) => setBvn(e.target.value)}
                placeholder="Enter your BVN"
                maxLength={11}
              />
            </motion.div>
          </CardContent>
        )
      case 3:
        return (
          <CardContent className="space-y-4">
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="id-upload">Upload Student ID Card</Label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-emerald-500 transition-colors cursor-pointer"
                onClick={() => document.getElementById('id-upload')?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                <Input 
                  id="id-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg"
                />
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h3 className="font-medium text-gray-800 mb-2">Loan Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount:</span>
                  <span className="font-medium text-emerald-600">₦{loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Purpose:</span>
                  <span className="font-medium text-gray-800">{purpose || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repayment Duration:</span>
                  <span className="font-medium text-gray-800">{repaymentDuration} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-medium text-emerald-600">{getInterestRate() * 100}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Payment:</span>
                  <span className="font-medium text-emerald-600">₦{calculateMonthlyPayment().toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-600">Total Repayment:</span>
                  <span className="text-emerald-600">₦{(calculateMonthlyPayment() * repaymentDuration).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank:</span>
                  <span className="font-medium text-gray-800">{bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-medium text-gray-800">{accountNumber}</span>
                </div>
              </div>
            </motion.div>
          </CardContent>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div className="w-full max-w-md" variants={containerVariants} initial="hidden" animate="visible">
        <Card className="bg-white shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center">
              {step > 1 && (
                <Button variant="ghost" size="icon" onClick={() => setStep(step - 1)} className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <CardTitle className="flex-1 text-center">Apply for Student Loan</CardTitle>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span className={step === 1 ? "text-emerald-600 font-medium" : ""}>Loan Details</span>
              <span className={step === 2 ? "text-emerald-600 font-medium" : ""}>Bank Information</span>
              <span className={step === 3 ? "text-emerald-600 font-medium" : ""}>Review & Submit</span>
            </div>
          </CardHeader>

            {renderStep()}

          <CardFooter className="flex justify-end space-x-2">
            {step < 3 ? (
            <Button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && (!loanAmount || !repaymentDuration || !purpose)) ||
                  (step === 2 && (!bankName || !accountNumber || !bvn))
                }
              >
                Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

