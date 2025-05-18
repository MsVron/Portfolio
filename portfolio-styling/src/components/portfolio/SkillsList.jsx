const SkillsList = ({ skills, className = "" }) => {
  if (!skills || skills.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {skills.map((skill, index) => (
        <span key={index} className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground">
          {skill}
        </span>
      ))}
    </div>
  )
}

export default SkillsList
