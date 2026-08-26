import { memo, useCallback, useMemo } from 'react';
import { trackClick } from '../hooks/useAnalytics.js';

const ENTRANCE_DIRECTIONS = [
  'reveal-slide-left',
  'reveal-slide-right',
  'reveal-slide-up',
  'reveal-scale',
  'reveal-flip-x',
];

function getDirectionForIndex(index) {
  return ENTRANCE_DIRECTIONS[index % ENTRANCE_DIRECTIONS.length];
}

const ProjectCard = memo(function ProjectCard({ project, index = 0, parentInView = false }) {
  const openGithub = useCallback(() => {
    trackClick(`github:${project.title}`);
    window.open(project.github, '_blank', 'noopener,noreferrer');
  }, [project.github, project.title]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openGithub();
    }
  }, [openGithub]);

  const stopCardClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const directionClass = useMemo(() => getDirectionForIndex(index), [index]);
  const delayClass = index <= 11 ? `reveal-delay-${index + 1}` : '';

  return (
    <article
      className={`card project-card project-card-3d ${directionClass} ${delayClass} ${parentInView ? 'is-visible' : ''}`}
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
            width="400"
            height="200"
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
            onClick={(e) => { stopCardClick(e); trackClick(`github:${project.title}`); }}
          >
            GitHub
          </a>
          {project.demo && (
            <a
              className="project-card__link project-card__link--demo"
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { stopCardClick(e); trackClick(`demo:${project.title}`); }}
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
