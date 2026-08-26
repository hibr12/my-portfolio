import { memo, useMemo } from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import { useData } from '../context/DataContext.jsx';
import { useInView } from '../hooks/useInView.js';

const SKILL_ENTRANCE_DIRECTIONS = [
  'reveal-slide-left',
  'reveal-slide-right',
  'reveal-slide-up',
  'reveal-scale',
  'reveal-flip-y',
];

function getSkillDirection(index) {
  return SKILL_ENTRANCE_DIRECTIONS[index % SKILL_ENTRANCE_DIRECTIONS.length];
}

const SkillCard = memo(function SkillCard({ group, index }) {
  const [ref, isInView] = useInView();
  const directionClass = useMemo(() => getSkillDirection(index), [index]);

  return (
    <article
      ref={ref}
      className={`card skill-card skill-card-3d ${directionClass} reveal-delay-${index + 1} ${isInView ? 'is-visible' : ''}`}
      key={group.id || group.title}
    >
      <h3>{group.title}</h3>
      <div className="tag-list">
        {group.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </article>
  );
});

const Skills = memo(function Skills() {
  const { skillGroups } = useData();
  const [sectionRef, sectionInView] = useInView({ threshold: 0.1 });

  return (
    <section ref={sectionRef} className={`section ${sectionInView ? 'is-visible' : ''}`} id="skills" aria-labelledby="skills-heading">
      <SectionHeading eyebrow="Skills" title="Tools I use to build">
        I focus on practical technologies for building modern, maintainable web applications.
      </SectionHeading>

      <div className="skills-grid perspective-container">
        {skillGroups.map((group, index) => (
          <SkillCard group={group} index={index} key={group.id || group.title} />
        ))}
      </div>
    </section>
  );
});

export default Skills;
