const SkillsList = ({ skills, className = "" }) => {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const { category } = skill
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {})

  // Define category icons or colors
  const categoryStyles = {
    Frontend: { color: "text-blue-400", bgColor: "bg-blue-400/10" },
    Backend: { color: "text-green-400", bgColor: "bg-green-400/10" },
    Database: { color: "text-yellow-400", bgColor: "bg-yellow-400/10" },
    DevOps: { color: "text-red-400", bgColor: "bg-red-400/10" },
    Design: { color: "text-purple-400", bgColor: "bg-purple-400/10" },
    Other: { color: "text-gray-400", bgColor: "bg-gray-400/10" },
  }

  return (
    <div className={`${className}`}>
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="mb-6">
          <h3 className={`text-lg font-semibold mb-3 ${categoryStyles[category]?.color || "text-white"}`}>
            {category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <div
                key={skill.id}
                className={`flex items-center px-3 py-2 rounded-lg ${categoryStyles[category]?.bgColor || "bg-gray-700"}`}
              >
                {skill.icon && <span className="mr-2">{skill.icon}</span>}
                <span className="text-sm font-medium">{skill.name}</span>
                {skill.level && (
                  <div className="ml-2 w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${categoryStyles[category]?.color.replace("text", "bg") || "bg-white"}`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkillsList
