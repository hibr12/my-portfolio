import { memo } from 'react';
import { useData } from '../context/DataContext.jsx';
import { useInView } from '../hooks/useInView.js';
import Carousel from '../components/Carousel.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

const Projects = memo(function Projects() {
  const { projects } = useData();
  const [sectionRef, sectionInView] = useInView({ threshold: 0.1 });

  return (
    <section
      ref={sectionRef}
      className={`section section--tinted ${sectionInView ? 'is-visible' : ''}`}
      id="projects"
      aria-labelledby="projects-heading"
    >
      <SectionHeading eyebrow="Projects" title="Selected work">
        A collection of full-stack and frontend projects that show my progress across React,
        backend APIs, databases, and responsive interface design.
      </SectionHeading>

      <Carousel projects={projects} />
    </section>
  );
});

export default Projects;