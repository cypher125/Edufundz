"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-emerald-600 mb-4">About EDUFUNDZ</h1>
          <p className="text-xl text-gray-600">Empowering YABATECH students through accessible education financing</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full border-emerald-100">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-emerald-700">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  At EDUFUNDZ, our mission is to make quality education accessible to all YABATECH students by providing
                  affordable and flexible loan options. We believe that financial constraints should never hinder a
                  student&apos;s educational journey and future prospects.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full border-emerald-100">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-emerald-700">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We envision a future where every YABATECH student has the financial means to complete their education
                  and pursue their dreams. EDUFUNDZ aims to be the leading student loan provider, known for our
                  student-centric approach, transparency, and commitment to educational empowerment.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-emerald-100">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-emerald-700">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                EDUFUNDZ was founded in 2023 by a group of YABATECH alumni who experienced firsthand the financial
                challenges of pursuing higher education. Recognizing the need for a dedicated financial support system
                for students, they created EDUFUNDZ to bridge the gap between educational aspirations and financial
                realities.
              </p>
              <p className="text-gray-600">
                Since our inception, we have been committed to understanding and addressing the unique needs of YABATECH
                students. Our team works tirelessly to develop loan products that are tailored to student life, with
                flexible repayment options and competitive interest rates.
              </p>
              <p className="text-gray-600">
                Today, EDUFUNDZ continues to grow and evolve, always keeping our core mission at heart: to empower
                students through accessible education financing. Wea&apos;re proud to be a part of the YABATECH community and
                to play a role in shaping the future of our students.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-emerald-600 mb-4">Join Our Community</h2>
            <p className="text-xl text-gray-600 mb-8">
              Be part of a growing community of students who are taking control of their educational journey.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
              Apply for a Loan
            </Button>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt="EDUFUNDZ community"
              width={400}
              height={300}
              className="rounded-lg shadow-xl"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

