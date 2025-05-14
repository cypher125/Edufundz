"use client"

import { motion } from "framer-motion"
import { BookOpen, Users, Banknote, Shield, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: BookOpen,
    title: "Easy Application",
    description: "Our streamlined process makes applying for a loan quick and hassle-free.",
  },
  {
    icon: Users,
    title: "Student-Focused",
    description: "Tailored specifically for YABATECH students, understanding your unique needs.",
  },
  {
    icon: Banknote,
    title: "Flexible Repayment",
    description: "Choose from a variety of repayment plans that fit your financial situation.",
  },
  {
    icon: Shield,
    title: "Secure & Transparent",
    description: "Your data and transactions are protected with state-of-the-art security measures.",
  },
]

const additionalFeatures = [
  "No collateral required",
  "Competitive interest rates",
  "Quick approval process",
  "Dedicated support team",
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-emerald-600 mb-4">Our Features</h1>
          <p className="text-xl text-gray-600">Discover why EDUFUNDZ is the best choice for student loans</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-emerald-100">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-emerald-500 mb-4" />
                  <CardTitle className="text-xl font-semibold text-emerald-700">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-emerald-50 rounded-lg shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-emerald-700 mb-6">Additional Benefits</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalFeatures.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-gray-700">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-emerald-600 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join EDUFUNDZ today and take the first step towards your educational goals.
          </p>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
            Apply Now
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

