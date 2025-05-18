import { ExternalLink, Github } from "lucide-react"

const ProjectCard = ({ project }) => {
  const { title, description, image, technologies, liveUrl, githubUrl } = project

  return (
    <div className="card overflow-hidden transition-all duration-300 hover:shadow-md group">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={image || "/placeholder.svg?height=200&width=400"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>

        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map((tech, index) => (
              <span key={index} className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-4">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              <Github className="h-4 w-4 mr-1" />
              Code
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
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
  )
}

export default ProjectCard
