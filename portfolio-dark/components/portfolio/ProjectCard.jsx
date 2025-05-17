import { Link } from "react-router-dom"
import Button from "../common/Button"

const ProjectCard = ({ project }) => {
  const { id, title, description, image, tags, demoUrl, codeUrl } = project

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg?height=192&width=384"}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 truncate">{title}</h3>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags &&
            tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-700 text-purple-300">
                {tag}
              </span>
            ))}
        </div>

        <div className="flex space-x-2">
          {demoUrl && (
            <Button as="a" href={demoUrl} target="_blank" rel="noopener noreferrer" variant="primary" size="sm">
              Live Demo
            </Button>
          )}

          {codeUrl && (
            <Button as="a" href={codeUrl} target="_blank" rel="noopener noreferrer" variant="outline" size="sm">
              View Code
            </Button>
          )}

          <Link to={`/portfolio/${id}`} className="ml-auto">
            <Button variant="ghost" size="sm">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
