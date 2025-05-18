"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { api } from "../../services/api"
import ProjectCard from "./ProjectCard"
import SkillsList from "./SkillsList"
import { ExternalLink, Mail, MapPin, Calendar, Briefcase, GraduationCap } from "lucide-react"

const PortfolioPreview = () => {
  const { currentUser } = useAuth()
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/portfolio/${currentUser.uid}`)
        setPortfolio(response.data)
      } catch (err) {
        console.error("Error fetching portfolio:", err)
        setError("Failed to load portfolio data")
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchPortfolio()
    }
  }, [currentUser])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-secondary rounded mb-4"></div>
          <div className="h-4 w-64 bg-secondary rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Portfolio Data</h2>
        <p className="text-muted-foreground mb-6">
          You haven't added any information to your portfolio yet. Complete your profile to see a preview.
        </p>
      </div>
    )
  }

  const { profile, projects, experience, education, skills } = portfolio

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{profile?.name || "Your Name"}</h1>
        <h2 className="text-xl md:text-2xl text-muted-foreground mb-6">{profile?.title || "Your Title"}</h2>

        <div className="flex flex-wrap gap-4 text-sm mb-6">
          {profile?.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-primary" />
              <a href={`mailto:${profile.email}`} className="hover:underline">
                {profile.email}
              </a>
            </div>
          )}
          {profile?.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile?.website && (
            <div className="flex items-center">
              <ExternalLink className="h-4 w-4 mr-2 text-primary" />
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {profile.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>

        <div className="prose max-w-none dark:prose-invert">
          <p>{profile?.bio || "Your professional bio will appear here."}</p>
        </div>
      </header>

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section className="mb-12">
          <h2 className="section-title">Skills</h2>
          <SkillsList skills={skills} />
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="mb-12">
          <h2 className="section-title">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section className="mb-12">
          <h2 className="section-title">Experience</h2>
          <div className="space-y-6">
            {experience.map((job, index) => (
              <div key={index} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-primary font-medium">{job.company}</p>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {job.startDate} - {job.endDate || "Present"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <p className="text-sm">{job.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <section className="mb-12">
          <h2 className="section-title">Education</h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{edu.degree}</h3>
                    <p className="text-primary font-medium">{edu.institution}</p>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {edu.startDate} - {edu.endDate || "Present"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  <span>{edu.fieldOfStudy}</span>
                </div>
                {edu.description && <p className="text-sm">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default PortfolioPreview
