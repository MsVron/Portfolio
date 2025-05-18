import { Routes, Route, Navigate } from "react-router-dom"
import Sidebar from "../components/dashboard/Sidebar"
import ProfileEditor from "../components/dashboard/ProfileEditor"
import EducationSection from "../components/dashboard/EducationSection"
import ExperienceSection from "../components/dashboard/ExperienceSection"
import ProjectsSection from "../components/dashboard/ProjectsSection"
import SkillsSection from "../components/dashboard/SkillsSection"
import SocialsSection from "../components/dashboard/SocialsSection"
import PortfolioPreview from "../components/dashboard/PortfolioPreview"

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-6">
        <div className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/profile" replace />} />
            <Route path="/profile" element={<ProfileEditor />} />
            <Route path="/education" element={<EducationSection />} />
            <Route path="/experience" element={<ExperienceSection />} />
            <Route path="/projects" element={<ProjectsSection />} />
            <Route path="/skills" element={<SkillsSection />} />
            <Route path="/socials" element={<SocialsSection />} />
            <Route path="/preview" element={<PortfolioPreview />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
