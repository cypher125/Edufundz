"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User, Mail, Phone, School, Edit2, Book, Calendar, Lock, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth"
import { userApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function ProfileComponent() {
  const { user: authUser } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    matricNumber: "",
    department: "",
    level: "",
    cgpa: "",
  })

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true)
        const userData = await userApi.getProfile()
        setProfile({
          name: userData.username || `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          email: userData.email || '',
          phone: userData.phone_number || '',
          matricNumber: userData.school_id || '',
          department: userData.school || '',
          level: '300', // Example default value
          cgpa: '3.8', // Example default value
        })
      } catch (error) {
        console.error("Error fetching user profile:", error)
        if (authUser) {
          setProfile({
            name: authUser.username || '',
            email: authUser.email || '',
            phone: '',
            matricNumber: '',
            department: '',
            level: '',
            cgpa: '',
          })
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserProfile()
  }, [authUser])

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      // Here you would send the updated profile to your backend
      // For now, we'll just simulate a successful update
      
      // In a real implementation, you would call an API like:
      // await userApi.updateProfile({
      //   first_name: profile.first_name,
      //   last_name: profile.last_name,
      //   phone_number: profile.phone_number,
      //   school: profile.school,
      //   school_id: profile.matricNumber,
      // })
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      })
      
    setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (loading && !isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 p-4 md:p-8"
    >
      <Card className="max-w-4xl mx-auto bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-emerald-600">Profile</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleEdit} disabled={loading}>
            <Edit2 className="h-5 w-5 text-emerald-600" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div className="flex items-center space-x-4" variants={itemVariants}>
            <div className="bg-emerald-100 rounded-full p-4">
              <User className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              {isEditing ? (
                <Input name="name" value={profile.name} onChange={handleChange} className="font-medium" disabled />
              ) : (
                <p className="font-medium text-gray-800">{profile.name}</p>
              )}
              <p className="text-sm text-gray-500">{profile.matricNumber}</p>
            </div>
          </motion.div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="academic">Academic Info</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <motion.div className="space-y-4" variants={itemVariants}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-emerald-600" />
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          className="flex-grow"
                          disabled
                        />
                      ) : (
                        <span className="text-gray-700">{profile.email}</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-emerald-600" />
                      {isEditing ? (
                        <Input
                          id="phone"
                          name="phone_number"
                          value={profile.phone_number}
                          onChange={handleChange}
                          className="flex-grow"
                        />
                      ) : (
                        <span className="text-gray-700">{profile.phone || "Not provided"}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            <TabsContent value="academic">
              <motion.div className="space-y-4" variants={itemVariants}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <div className="flex items-center space-x-2">
                      <School className="h-5 w-5 text-emerald-600" />
                      {isEditing ? (
                        <Input
                          id="school"
                          name="department"
                          value={profile.department}
                          onChange={handleChange}
                          className="flex-grow"
                        />
                      ) : (
                        <span className="text-gray-700">{profile.department || "Not provided"}</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="matricNumber">Matric Number</Label>
                    <div className="flex items-center space-x-2">
                      <Book className="h-5 w-5 text-emerald-600" />
                      {isEditing ? (
                        <Input
                          id="matricNumber"
                          name="matricNumber"
                          value={profile.matricNumber}
                          onChange={handleChange}
                          className="flex-grow"
                        />
                      ) : (
                        <span className="text-gray-700">{profile.matricNumber || "Not provided"}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            <TabsContent value="settings">
              <motion.div className="space-y-4" variants={itemVariants}>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive email updates about your account</p>
                  </div>
                  <Switch id="notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="two-factor" />
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    <Lock className="mr-2 h-4 w-4" /> Change Password
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>

          {isEditing && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSave} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Save Changes
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

