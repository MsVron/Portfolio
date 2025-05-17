"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { updateUserProfile, getUserProfile } from "../../services/api"
import Button from "../common/Button"

const ProfileEditor = () => {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [profileData, setProfileData] = useState({
    name: "",
    title: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    avatar: "",
    skills: [],
  })
  const [newSkill, setNewSkill] = useState({ name: "", category: "Other", level: 75 })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await getUserProfile(currentUser.uid)
        if (data) {
          setProfileData(data)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setMessage({ type: "error", text: "Failed to load profile data" })
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
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSkillChange = (e) => {
    const { name, value } = e.target
    setNewSkill((prev) => ({
      ...prev,
      [name]: name === "level" ? Number.parseInt(value) : value,
    }))
  }

  const addSkill = () => {
    if (!newSkill.name.trim()) return

    setProfileData((prev) => ({
      ...prev,
      skills: [...prev.skills, { ...newSkill, id: Date.now().toString() }],
    }))

    setNewSkill({ name: "", category: "Other", level: 75 })
  }

  const removeSkill = (skillId) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== skillId),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setMessage({ type: "", text: "" })

      await updateUserProfile(currentUser.uid, profileData)

      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage({ type: "error", text: "Failed to update profile" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Edit Your Profile</h2>

      {message.text && (
        <div
          className={`mb-6 px-4 py-3 rounded-md ${
            message.type === "success"
              ? "bg-green-900/50 border border-green-700 text-green-200"
              : "bg-red-900/50 border border-red-700 text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Professional Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={profileData.title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. Frontend Developer"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={profileData.location}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. New York, NY"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-300">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={profileData.website}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-300">
                Avatar URL
              </label>
              <input
                type="url"
                id="avatar"
                name="avatar"
                value={profileData.avatar}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-300">
                GitHub Profile
              </label>
              <input
                type="url"
                id="github"
                name="github"
                value={profileData.github}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300">
                LinkedIn Profile
              </label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={profileData.linkedin}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-300">
                Twitter Profile
              </label>
              <input
                type="url"
                id="twitter"
                name="twitter"
                value={profileData.twitter}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            value={profileData.bio}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Skills</h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {profileData.skills.map((skill) => (
              <div key={skill.id} className="flex items-center px-3 py-1.5 rounded-full bg-gray-700 text-white">
                <span>{skill.name}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="ml-2 text-gray-400 hover:text-red-400"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                name="name"
                value={newSkill.name}
                onChange={handleSkillChange}
                className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Add a skill..."
              />
            </div>

            <div>
              <select
                name="category"
                value={newSkill.category}
                onChange={handleSkillChange}
                className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Design">Design</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="range"
                name="level"
                min="0"
                max="100"
                value={newSkill.level}
                onChange={handleSkillChange}
                className="w-full"
              />
              <span className="text-white">{newSkill.level}%</span>
              <Button type="button" variant="secondary" size="sm" onClick={addSkill}>
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProfileEditor
