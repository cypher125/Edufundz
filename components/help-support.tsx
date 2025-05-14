"use client"

import { motion } from "framer-motion"
import { Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function HelpSupport() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <motion.div
        className="max-w-2xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-600">Call us: +234 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-600">Email: support@edutext.com</span>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-800 mb-2">Send us a message</h3>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="How can we help you?" />
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Send Message</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800">How do I apply for a loan?</h3>
                <p className="text-sm text-gray-600">
                  You can apply for a loan by logging into your account and navigating to the Loan Application page.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">When do I need to repay my loan?</h3>
                <p className="text-sm text-gray-600">
                  Loan repayment dates are set based on your chosen repayment plan. You can view your next payment due
                  date on the Repayment page.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">What happens if I miss a payment?</h3>
                <p className="text-sm text-gray-600">
                  If you miss a payment, additional fees may apply. Please contact our support team immediately if
                  you're having trouble making a payment.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

