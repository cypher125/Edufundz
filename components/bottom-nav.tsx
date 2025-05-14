"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, FileText, HelpCircle, User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/dashboard/transactions", icon: FileText, label: "History" },
    { href: "/dashboard/loan-reason", icon: Plus, label: "Loan" },
    { href: "/dashboard/support", icon: HelpCircle, label: "Support" },
    { href: "/dashboard/profile", icon: User, label: "Profile" },
  ]

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg py-2 px-6 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
      }}
    >
      <div className="flex justify-between items-center">
        {navItems.map((item, index) => (
          <Button
            key={item.href}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center ${
              index === 2 ? "relative -top-4" : ""
            } ${pathname === item.href ? "text-emerald-600" : "text-gray-300"}`}
            asChild
          >
            <Link href={item.href}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center ${index === 2 ? "relative" : ""}`}
              >
                <div className={`${index === 2 ? "bg-emerald-500 p-4 rounded-2xl shadow-lg" : ""}`}>
                  <item.icon className={`${index === 2 ? "h-6 w-6 text-white" : "h-5 w-5"}`} />
                </div>
                <span className={`text-xs mt-1 ${index === 2 ? "mt-2" : ""}`}>{item.label}</span>
              </motion.div>
            </Link>
          </Button>
        ))}
      </div>
    </motion.div>
  )
}

