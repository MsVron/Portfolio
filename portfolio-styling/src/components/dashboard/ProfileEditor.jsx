"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { api } from "../../services/api"
import Button from "../common/Button"
import Notification from "../common/Notification"
import { User, Mail, MapPin, Globe, Save } from "lucide-react"

const ProfileEditor = () => {
  const { currentUser } = useAuth()
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    bio: "",
    email: "",
    location: "",
    website: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/portfolio/${currentUser.uid}/profile`)
        if (response.data) {
          setProfile(response.data)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setNotification({
          type: "error",
          message: "Failed to load profile data",
        })
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchProfile()
    }
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      await api.put(`/portfolio/${currentUser.uid}/profile`, profile)
      setNotification({
        type: "success",
        message: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      setNotification({
        type: "error",
        message: "Failed to update profile",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-secondary rounded"></div>
        <div className="h-64 bg-secondary rounded"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="section-title">Edit Profile</h1>

      {notification && (
        <Notification
          variant={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Professional Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={profile.title}
                onChange={handleChange}
                className="input"
                placeholder="Full Stack Developer"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={profile.location}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium mb-1">
                Website
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={profile.website}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium mb-1">
                Professional Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={5}
                className="input min-h-[120px]"
                placeholder="Write a short professional bio..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="flex items-center">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProfileEditor
