import SectionHeading from '../components/SectionHeading.jsx';
import { useData } from '../context/DataContext.jsx';

function Skills() {
  const { skillGroups } = useData();

  return (
    <section className="section" id="skills">
      <SectionHeading eyebrow="Skills" title="Tools I use to build">
        I focus on practical technologies for building modern, maintainable web applications.
      </SectionHeading>

      <div className="skills-grid">
        {skillGroups.map((group) => (
          <article className="card skill-card reveal" key={group.id || group.title}>
            <h3>{group.title}</h3>
            <div className="tag-list">
              {group.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Skills;
