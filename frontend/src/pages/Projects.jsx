import ProjectCard from '../components/ProjectCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { useData } from '../context/DataContext.jsx';

function Projects() {
  const { projects } = useData();

  return (
    <section className="section section--tinted" id="projects">
      <SectionHeading eyebrow="Projects" title="Selected work">
        A collection of full-stack and frontend projects that show my progress across React,
        backend APIs, databases, and responsive interface design.
      </SectionHeading>

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id || project.title} project={project} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
