function ProjectCard({ project }) {
  return (
    <article className="card project-card reveal">
      <div>
        <p className="eyebrow">Featured Project</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>

      <div className="tag-list" aria-label={`${project.title} technologies`}>
        {project.technologies.map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
      </div>

      <div className="card__actions">
        <a href={project.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noreferrer">
            Live Demo
          </a>
        )}
      </div>
    </article>
  );
}

export default ProjectCard;
