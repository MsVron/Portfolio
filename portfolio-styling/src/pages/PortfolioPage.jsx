"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { api } from "../services/api"
import ProjectCard from "../components/portfolio/ProjectCard"
import SkillsList from "../components/portfolio/SkillsList"
import { ExternalLink, Mail, MapPin, Calendar, Briefcase, GraduationCap, Github, Linkedin, Twitter } from "lucide-react"

const PortfolioPage = () => {
  const { username } = useParams()
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/portfolio/${username}`)
        setPortfolio(response.data)
      } catch (err) {
        console.error("Error fetching portfolio:", err)
        setError("Failed to load portfolio data")
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchPortfolio()
    }
  }, [username])

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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Portfolio Not Found</h2>
        <p className="text-muted-foreground">The portfolio you're looking for doesn't exist or is not public.</p>
      </div>
    )
  }

  const { profile, projects, experience, education, skills, socials } = portfolio

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{profile?.name || "Portfolio"}</h1>
            {profile?.title && <p className="text-xl text-muted-foreground">{profile.title}</p>}
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm mb-8">
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

          {socials && socials.length > 0 && (
            <div className="flex justify-center space-x-4 mb-8">
              {socials.map((social, index) => {
                let Icon = ExternalLink
                if (social.platform.toLowerCase().includes("github")) Icon = Github
                if (social.platform.toLowerCase().includes("linkedin")) Icon = Linkedin
                if (social.platform.toLowerCase().includes("twitter")) Icon = Twitter

                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                    aria-label={social.platform}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          )}

          {profile?.bio && (
            <div className="prose max-w-none dark:prose-invert mx-auto text-center">
              <p>{profile.bio}</p>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <section className="mb-16">
            <h2 className="section-title text-center">Skills</h2>
            <SkillsList skills={skills} className="justify-center" />
          </section>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <section className="mb-16">
            <h2 className="section-title text-center mb-8">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <section className="mb-16">
            <h2 className="section-title text-center mb-8">Experience</h2>
            <div className="space-y-8">
              {experience.map((job, index) => (
                <div key={index} className="card p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      <p className="text-primary font-medium">{job.company}</p>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>
                        {job.startDate} - {job.endDate || "Present"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Briefcase className="h-4 w-4 mr-1 flex-shrink-0" />
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
          <section className="mb-16">
            <h2 className="section-title text-center mb-8">Education</h2>
            <div className="space-y-8">
              {education.map((edu, index) => (
                <div key={index} className="card p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-bold">{edu.degree}</h3>
                      <p className="text-primary font-medium">{edu.institution}</p>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>
                        {edu.startDate} - {edu.endDate || "Present"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <GraduationCap className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{edu.fieldOfStudy}</span>
                  </div>
                  {edu.description && <p className="text-sm">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className="text-center">
          <h2 className="section-title">Get In Touch</h2>
          <p className="text-muted-foreground mb-6">Interested in working together? Feel free to reach out!</p>
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="btn btn-primary inline-flex items-center px-6 py-3">
              <Mail className="h-5 w-5 mr-2" />
              Contact Me
            </a>
          )}
        </section>
      </div>
    </div>
  )
}

export default PortfolioPage
