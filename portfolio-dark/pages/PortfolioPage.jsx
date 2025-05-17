"use client"

import { useState, useEffect } from "react"
import { getProjects } from "../services/api"
import ProjectCard from "../components/portfolio/ProjectCard"
import SkillsList from "../components/portfolio/SkillsList"

const PortfolioPage = () => {
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const projectsData = await getProjects()
        setProjects(projectsData)

        // Extract unique skills from projects
        const allSkills = []
        projectsData.forEach((project) => {
          project.tags.forEach((tag) => {
            if (!allSkills.some((skill) => skill.name === tag)) {
              allSkills.push({
                id: tag.toLowerCase().replace(/\s+/g, "-"),
                name: tag,
                category: getCategoryForTag(tag),
                level: Math.floor(Math.random() * 30) + 70, // Random level between 70-100 for demo
              })
            }
          })
        })

        setSkills(allSkills)
      } catch (error) {
        console.error("Error fetching portfolio data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to categorize tags
  const getCategoryForTag = (tag) => {
    const frontendTags = ["React", "Vue", "Angular", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind"]
    const backendTags = ["Node.js", "Express", "Django", "Flask", "PHP", "Laravel", "Ruby", "Rails"]
    const databaseTags = ["MongoDB", "MySQL", "PostgreSQL", "Firebase", "Supabase", "Redis"]
    const devopsTags = ["Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Jenkins"]
    const designTags = ["UI/UX", "Figma", "Sketch", "Photoshop", "Illustrator"]

    if (frontendTags.some((t) => tag.includes(t))) return "Frontend"
    if (backendTags.some((t) => tag.includes(t))) return "Backend"
    if (databaseTags.some((t) => tag.includes(t))) return "Database"
    if (devopsTags.some((t) => tag.includes(t))) return "DevOps"
    if (designTags.some((t) => tag.includes(t))) return "Design"

    return "Other"
  }

  // Filter projects based on selected filter and search query
  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filter === "all" || project.tags.includes(filter)
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">My Portfolio</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">A showcase of my projects and professional work</p>
        </div>

        {/* Skills Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Skills & Expertise</h2>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <SkillsList skills={skills} />
          </div>
        </section>

        {/* Projects Section */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">Projects</h2>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <svg
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Projects</option>
                {Array.from(new Set(projects.flatMap((project) => project.tags))).map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No projects found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default PortfolioPage
