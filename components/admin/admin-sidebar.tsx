"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, Users, FileText, CreditCard, Settings, LogOut, ChevronLeft, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAdminAuth } from "@/lib/adminAuth"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { logout } = useAdminAuth()

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      title: "Users",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Loan Applications",
      icon: FileText,
      href: "/admin/loans",
    },
    {
      title: "Disbursements",
      icon: CreditCard,
      href: "/admin/disbursements",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ]

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-gray-100 z-30"
    >
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {!isCollapsed && (
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-bold text-emerald-600">
              EDUFUNDZ Admin
            </motion.h1>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-auto">
            {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      pathname === item.href ? "bg-emerald-50 text-emerald-600" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

