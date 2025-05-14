"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { ArrowRight, BookOpen, Users, Banknote, Shield, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }))
  }, [controls])

  const features = [
    { icon: BookOpen, title: "Easy Application", description: "Simple and quick loan application process" },
    { icon: Users, title: "Student-Focused", description: "Tailored specifically for YABATECH students" },
    { icon: Banknote, title: "Flexible Repayment", description: "Affordable repayment plans to suit your needs" },
    { icon: Shield, title: "Secure & Transparent", description: "Your data and transactions are always protected" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-emerald-600"
          >
            EDUFUNDZ
          </motion.h1>
          <nav>
            <ul className="flex space-x-6">
              {["Features", "About", "Contact"].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10"
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Empower Your <span className="text-emerald-600">Education</span> with EDUFUNDZ
                </h2>
                <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
                  Affordable student loans tailored for YABATECH students. Your future starts here with flexible payment plans and quick approval process.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More <ChevronDown className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="mt-12 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-emerald-600">500+</h3>
                    <p className="text-sm text-gray-600">Students Funded</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-emerald-600">₦50M+</h3>
                    <p className="text-sm text-gray-600">Loans Disbursed</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-emerald-600">98%</h3>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                </div>
              </motion.div>

              {/* Right Content with Floating Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative w-full h-[600px]">
                  <Image
                    src="/landing_page/student_hero.jpg"
                    alt="Student studying"
                    fill
                    className="object-cover rounded-2xl shadow-2xl"
                    priority
                  />
                  {/* Floating Elements */}
                  <motion.div
                    initial={{ x: 20, y: 20 }}
                    animate={{ x: 0, y: 0 }}
                    transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                    className="absolute -top-8 -left-8 bg-white p-4 rounded-xl shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-2 rounded-full">
                        <BookOpen className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Quick Approval</p>
                        <p className="text-sm text-gray-600">24-48 hours</p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, y: -20 }}
                    animate={{ x: 0, y: 0 }}
                    transition={{ repeat: Infinity, duration: 2, repeatType: "reverse", delay: 0.5 }}
                    className="absolute -bottom-8 -right-8 bg-white p-4 rounded-xl shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-2 rounded-full">
                        <Banknote className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Flexible Payment</p>
                        <p className="text-sm text-gray-600">Student-friendly terms</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-100 rounded-full opacity-20" />
            <div className="absolute top-1/2 -left-24 w-48 h-48 bg-emerald-50 rounded-full opacity-30" />
            <div className="absolute -bottom-8 right-1/4 w-24 h-24 bg-emerald-200 rounded-full opacity-25" />
          </div>
        </section>

        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-center text-gray-800 mb-12"
            >
              Why Choose EDUFUNDZ?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div key={feature.title} custom={index} initial={{ opacity: 0, y: 50 }} animate={controls}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <feature.icon className="h-12 w-12 text-emerald-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 mb-8 md:mb-0 md:pr-8"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-4">About EDUFUNDZ</h2>
                <p className="text-gray-600 mb-4">
                  EDUFUNDZ is a student loan platform designed specifically for YABATECH students. We understand the
                  financial challenges that come with pursuing higher education, and we&apos;re here to help.
                </p>
                <p className="text-gray-600">
                  Our mission is to make education accessible to all by providing affordable and flexible loan options.
                  With EDUFUNDZ, you can focus on your studies while we take care of your financial needs.
                </p>
                <Link href="/about" passHref>
                  <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white">Learn More About Us</Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:w-1/2"
              >
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="EDUFUNDZ team"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-center text-gray-800 mb-12"
            >
              What Our Students Say
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Ade Johnson", quote: "EDUFUNDZ made my dream of studying engineering a reality." },
                {
                  name: "Blessing Okafor",
                  quote: "The application process was so easy, and the team was very helpful.",
                },
                {
                  name: "Chukwu Emeka",
                  quote: "Thanks to EDUFUNDZ, I can focus on my studies without financial stress.",
                },
              ].map((testimonial, index) => (
                <motion.div key={testimonial.name} custom={index} initial={{ opacity: 0, y: 50 }} animate={controls}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                      <p className="font-semibold text-emerald-600">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">YABATECH Student</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="py-20 bg-emerald-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-4"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl mb-8 max-w-2xl mx-auto"
            >
              Join EDUFUNDZ today and take the first step towards your educational goals.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/auth" passHref>
                <Button className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EDUFUNDZ</h3>
              <p className="text-sm">Empowering education through financial support</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <nav>
                <ul className="space-y-2">
                  {["Features", "About", "Contact"].map((item) => (
                    <li key={item}>
                      <Link href={`/${item.toLowerCase()}`} className="hover:text-emerald-400">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="text-sm mb-2">Email: support@edutext.com</p>
              <p className="text-sm mb-2">Phone: +234 123 456 7890</p>
              <p className="text-sm">Address: 123 YABATECH Road, Lagos, Nigeria</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
            &copy; {new Date().getFullYear()} EDUFUNDZ. All rights reserved.
          </div>
        </div>
      </footer>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8"
      >
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg"
        >
          <ChevronDown className="h-6 w-6 transform rotate-180" />
        </Button>
      </motion.div>
    </div>
  )
}
