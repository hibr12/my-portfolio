import { memo, useCallback, useMemo } from 'react';

const ProjectCard = memo(function ProjectCard({ project, index = 0 }) {
  const openGithub = useCallback(() => {
    window.open(project.github, '_blank', 'noopener,noreferrer');
  }, [project.github]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openGithub();
    }
  }, [openGithub]);

  const directionClass = useMemo(() => {
    const directions = [
      'reveal-slide-left',
      'reveal-slide-right',
      'reveal-slide-up',
      'reveal-scale',
    ];
    return directions[index % directions.length];
  }, [index]);

  return (
    <article
      className={`card project-card ${directionClass}`}
      style={project.image ? { '--project-image': `url(${project.image})` } : undefined}
      role="link"
      tabIndex={0}
      aria-label={`Open ${project.title} GitHub repository`}
      onClick={openGithub}
      onKeyDown={handleKeyDown}
    >
      <div className="project-card__image" aria-hidden="true">
        {project.image && (
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>

      <div className="project-card__content">
        <div className="project-card__summary">
          <p className="eyebrow">Featured Project</p>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>

        <div className="tag-list" aria-label={`${project.title} technologies`}>
          {project.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>

        <div className="card__actions project-card__actions">
          <a
            className="project-card__link"
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => window.open(project.github, '_blank', 'noopener,noreferrer')}
          >
            GitHub
          </a>
          {project.demo && (
            <a
              className="project-card__link project-card__link--demo"
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
});

export default ProjectCard;