"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Download, UserPlus, Mail, School } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeThisMonth: 0,
    verifiedUsers: 0
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/users')
        
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.status}`)
        }
        
        const data = await response.json()
        setUsers(data)
        
        // Calculate statistics
        const total = data.length
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        
        const activeThisMonth = data.filter(user => {
          const lastLoginDate = user.last_login ? new Date(user.last_login) : null
          return lastLoginDate && lastLoginDate > oneMonthAgo
        }).length
        
        const verified = data.filter(user => user.is_verified).length
        
        setStats({
          totalUsers: total,
          activeThisMonth: total > 0 ? Math.round((activeThisMonth / total) * 100) : 0,
          verifiedUsers: total > 0 ? Math.round((verified / total) * 100) : 0
        })
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "Failed to fetch user data",
          variant: "destructive",
        })
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) =>
    Object.values(user).some(
      (value) => typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  )

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <div className="flex gap-4">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Download className="mr-2 h-4 w-4" />
              Export Users
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Total Users",
                  value: stats.totalUsers,
                  icon: School,
                  className: "bg-emerald-50 text-emerald-700",
                },
                {
                  title: "Active This Month",
                  value: `${stats.activeThisMonth}%`,
                  icon: UserPlus,
                  className: "bg-blue-50 text-blue-700",
                },
                {
                  title: "Verified Users",
                  value: `${stats.verifiedUsers}%`,
                  icon: Mail,
                  className: "bg-purple-50 text-purple-700",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={stat.className}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Matric No.</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Join Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <Link
                                href={`/admin/users/${user.id}`}
                                className="text-emerald-600 hover:text-emerald-700 hover:underline"
                              >
                                {user.full_name || `${user.first_name || ''} ${user.last_name || ''}`}
                              </Link>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone_number || 'N/A'}</TableCell>
                            <TableCell>{user.matric_number || 'N/A'}</TableCell>
                            <TableCell>{user.department || 'N/A'}</TableCell>
                            <TableCell>{new Date(user.date_joined || user.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

