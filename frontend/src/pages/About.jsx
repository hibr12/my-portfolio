import { memo, useMemo } from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import { useData } from '../context/DataContext.jsx';
import { useInView } from '../hooks/useInView.js';

const ABOUT_ENTRANCE_DIRECTIONS = [
  'reveal-slide-left',
  'reveal-slide-right',
  'reveal-slide-up',
  'reveal-scale',
];

function getAboutDirection(index) {
  return ABOUT_ENTRANCE_DIRECTIONS[index % ABOUT_ENTRANCE_DIRECTIONS.length];
}

const AboutCard = memo(function AboutCard({ card, index }) {
  const [ref, isInView] = useInView();
  const directionClass = useMemo(() => getAboutDirection(index), [index]);

  return (
    <article
      ref={ref}
      className={`card card-3d ${directionClass} reveal-delay-${index + 1} ${isInView ? 'is-visible' : ''}`}
      key={card.title}
    >
      <h3>{card.title}</h3>
      <p>{card.text}</p>
    </article>
  );
});

const About = memo(function About() {
  const { settings } = useData();
  const { about } = settings;
  const [sectionRef, sectionInView] = useInView({ threshold: 0.1 });

  return (
    <section ref={sectionRef} className={`section ${sectionInView ? 'is-visible' : ''}`} id="about" aria-labelledby="about-heading">
      <SectionHeading eyebrow={about.eyebrow} title={about.heading}>
        {about.description}
      </SectionHeading>

      <div className="about-grid perspective-container">
        {about.cards.map((card, index) => (
          <AboutCard card={card} index={index} key={card.title} />
        ))}
      </div>
    </section>
  );
});

export default About;
