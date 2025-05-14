"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, CreditCard, FileText, HelpCircle, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/loan-reason", icon: CreditCard, label: "Loans" },
  { href: "/dashboard/transactions", icon: FileText, label: "Transactions" },
  { href: "/dashboard/support", icon: HelpCircle, label: "Support" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
]

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <motion.div
      className="fixed left-0 top-0 h-full bg-white shadow-lg z-50"
      initial={{ width: isOpen ? 256 : 80 }}
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <Button variant="ghost" size="icon" onClick={toggleMenu} className="mb-6">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={`flex items-center space-x-4 p-2 rounded-lg transition-colors ${
                  pathname === item.href ? "bg-emerald-100 text-emerald-600" : "text-gray-600 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="h-5 w-5" />
                {isOpen && <span>{item.label}</span>}
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  )
}

