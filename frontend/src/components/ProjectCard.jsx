import { trackClick } from '../hooks/useAnalytics.js';

function ProjectCard({ project }) {
  const openGithub = () => {
    trackClick(`github:${project.title}`);
    window.open(project.github, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openGithub();
    }
  };

  const stopCardClick = (event) => {
    event.stopPropagation();
  };

  return (
    <article
      className="card project-card reveal"
      style={project.image ? { '--project-image': `url(${project.image})` } : undefined}
      role="link"
      tabIndex={0}
      aria-label={`Open ${project.title} GitHub repository`}
      onClick={openGithub}
      onKeyDown={handleKeyDown}
    >
      <div className="project-card__image" aria-hidden="true" />

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
            rel="noreferrer"
            onClick={(e) => { stopCardClick(e); trackClick(`github:${project.title}`); }}
          >
            GitHub
          </a>
          {project.demo && (
            <a
              className="project-card__link project-card__link--demo"
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => { stopCardClick(e); trackClick(`demo:${project.title}`); }}
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
