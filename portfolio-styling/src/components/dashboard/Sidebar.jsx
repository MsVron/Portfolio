"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { User, Briefcase, GraduationCap, Code, Share2, Settings, ChevronLeft, ChevronRight } from "lucide-react"

const Sidebar = () => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { path: "/dashboard/profile", label: "Profile", icon: User },
    { path: "/dashboard/experience", label: "Experience", icon: Briefcase },
    { path: "/dashboard/education", label: "Education", icon: GraduationCap },
    { path: "/dashboard/projects", label: "Projects", icon: Code },
    { path: "/dashboard/skills", label: "Skills", icon: Code },
    { path: "/dashboard/socials", label: "Socials", icon: Share2 },
    { path: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  return (
    <aside
      className={`bg-sidebar text-sidebar-foreground h-screen transition-all duration-300 border-r border-sidebar-border ${
        collapsed ? "w-16" : "w-64"
      } fixed left-0 top-16 z-10`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b border-sidebar-border">
          <h2 className={`font-bold text-lg ${collapsed ? "hidden" : "block"}`}>Dashboard</h2>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    isActive(item.path)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className={collapsed ? "hidden" : "block"}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
