import { memo } from 'react';
import ProjectCard from '../components/ProjectCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { useData } from '../context/DataContext.jsx';
import { useInView } from '../hooks/useInView.js';

const Projects = memo(function Projects() {
  const { projects } = useData();
  const [sectionRef, sectionInView] = useInView({ threshold: 0.1 });
  const [gridRef, gridInView] = useInView({ threshold: 0.05 });

  return (
    <section ref={sectionRef} className={`section section--tinted ${sectionInView ? 'is-visible' : ''}`} id="projects" aria-labelledby="projects-heading">
      <SectionHeading eyebrow="Projects" title="Selected work">
        A collection of full-stack and frontend projects that show my progress across React,
        backend APIs, databases, and responsive interface design.
      </SectionHeading>

      <div
        ref={gridRef}
        className={`projects-grid perspective-container ${gridInView ? 'is-visible' : ''}`}
      >
        {projects.map((project, index) => (
          <ProjectCard key={project.id || project.title} project={project} index={index} parentInView={gridInView} />
        ))}
      </div>
    </section>
  );
});

export default Projects;
