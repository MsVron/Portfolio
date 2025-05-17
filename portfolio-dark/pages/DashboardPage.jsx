"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import ProfileEditor from "../components/dashboard/ProfileEditor"
import PortfolioPreview from "../components/dashboard/PortfolioPreview"
import Button from "../components/common/Button"

const DashboardPage = () => {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-white">Please log in to access the dashboard.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage your portfolio and profile</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
              activeTab === "profile"
                ? "bg-gray-800 text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
              activeTab === "projects"
                ? "bg-gray-800 text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
              activeTab === "preview"
                ? "bg-gray-800 text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
              activeTab === "settings"
                ? "bg-gray-800 text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {activeTab === "profile" && <ProfileEditor />}

          {activeTab === "projects" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">My Projects</h2>
                <Button variant="primary" size="sm">
                  Add New Project
                </Button>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="text-xl font-medium text-white mb-2">No projects yet</h3>
                <p className="text-gray-400 mb-6">Start showcasing your work by adding your first project</p>
                <Button variant="primary">Create Your First Project</Button>
              </div>
            </div>
          )}

          {activeTab === "preview" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Portfolio Preview</h2>
              <PortfolioPreview />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

              <div className="space-y-6">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={currentUser.email}
                        disabled
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        placeholder="Set your username"
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div className="pt-2">
                      <Button variant="primary">Update Password</Button>
                    </div>
                  </div>
                </div>

                <div className="bg-red-900/30 border border-red-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-2">Danger Zone</h3>
                  <p className="text-gray-300 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="danger">Delete Account</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
