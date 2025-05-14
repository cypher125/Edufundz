"use client"

import { AdminAuthProvider } from "@/lib/admin-auth"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function SidebarLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={`flex items-center p-3 rounded-lg mb-1 hover:bg-green-50 ${
        isActive ? 'bg-green-100 text-green-800' : 'text-gray-700'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function AdminSidebar() {
    return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 py-6 px-4">
      <div className="mb-8 px-4">
        <h1 className="text-2xl font-bold text-green-700">EduFundz Admin</h1>
      </div>
      
      <nav>
        <SidebarLink href="/admin" label="Dashboard" icon="📊" />
        <SidebarLink href="/admin/users" label="Users" icon="👥" />
        <SidebarLink href="/admin/loans" label="Loans" icon="💰" />
        <SidebarLink href="/admin/applications" label="Applications" icon="📝" />
        <SidebarLink href="/admin/repayments" label="Repayments" icon="💸" />
        <SidebarLink href="/admin/settings" label="Settings" icon="⚙️" />
      </nav>
      
      <div className="absolute bottom-6 px-4">
        <SidebarLink href="/admin/logout" label="Logout" icon="🚪" />
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gray-50 flex">
          <AdminSidebar />
        <div className="ml-64 flex-1 p-8">
          {children}
        </div>
      </div>
    </AdminAuthProvider>
  )
}

