"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { api } from "../../services/api"
import Button from "../common/Button"
import Notification from "../common/Notification"
import { Plus, Edit, Trash2, ExternalLink, Github, Save, X } from "lucide-react"

const ProjectsSection = () => {
  const { currentUser } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [notification, setNotification] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
  })

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/portfolio/${currentUser.uid}/projects`)
        setProjects(response.data || [])
      } catch (error) {
        console.error("Error fetching projects:", error)
        setNotification({
          type: "error",
          message: "Failed to load projects",
        })
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchProjects()
    }
  }, [currentUser])

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
    })
    setEditingIndex(null)
    setShowForm(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEdit = (index) => {
    const project = projects[index]
    setFormData({
      ...project,
      technologies: project.technologies ? project.technologies.join(", ") : "",
    })
    setEditingIndex(index)
    setShowForm(true)
  }

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return
    }

    try {
      const projectId = projects[index].id
      await api.delete(`/portfolio/${currentUser.uid}/projects/${projectId}`)

      setProjects((prev) => prev.filter((_, i) => i !== index))
      setNotification({
        type: "success",
        message: "Project deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting project:", error)
      setNotification({
        type: "error",
        message: "Failed to delete project",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const projectData = {
      ...formData,
      technologies: formData.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech),
    }

    try {
      if (editingIndex !== null) {
        // Update existing project
        const projectId = projects[editingIndex].id
        await api.put(`/portfolio/${currentUser.uid}/projects/${projectId}`, projectData)

        setProjects((prev) => prev.map((project, i) => (i === editingIndex ? { ...project, ...projectData } : project)))

        setNotification({
          type: "success",
          message: "Project updated successfully",
        })
      } else {
        // Create new project
        const response = await api.post(`/portfolio/${currentUser.uid}/projects`, projectData)

        setProjects((prev) => [...prev, response.data])

        setNotification({
          type: "success",
          message: "Project added successfully",
        })
      }

      resetForm()
    } catch (error) {
      console.error("Error saving project:", error)
      setNotification({
        type: "error",
        message: "Failed to save project",
      })
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="section-title mb-0">Projects</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        )}
      </div>

      {notification && (
        <Notification
          variant={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          className="mb-6"
        />
      )}

      {showForm && (
        <div className="card p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{editingIndex !== null ? "Edit Project" : "Add New Project"}</h2>
            <button
              onClick={resetForm}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Project Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  placeholder="My Awesome Project"
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="input min-h-[80px]"
                  placeholder="Describe your project..."
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="technologies" className="block text-sm font-medium mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  id="technologies"
                  name="technologies"
                  type="text"
                  value={formData.technologies}
                  onChange={handleChange}
                  className="input"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium mb-1">
                  GitHub URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Github className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="githubUrl"
                    name="githubUrl"
                    type="url"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="liveUrl" className="block text-sm font-medium mb-1">
                  Live Demo URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="liveUrl"
                    name="liveUrl"
                    type="url"
                    value={formData.liveUrl}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="https://myproject.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                {editingIndex !== null ? "Update Project" : "Save Project"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
          <p className="text-muted-foreground mb-6">Showcase your work by adding projects to your portfolio.</p>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} variant="secondary" className="flex items-center mx-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div key={index} className="card overflow-hidden group">
              <div className="relative aspect-video bg-muted">
                {project.image ? (
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`Edit ${project.title}`}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete ${project.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectsSection
