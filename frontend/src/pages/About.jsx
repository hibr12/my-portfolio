import SectionHeading from '../components/SectionHeading.jsx';
import { useData } from '../context/DataContext.jsx';

function About() {
  const { settings } = useData();
  const { about } = settings;

  return (
    <section className="section" id="about">
      <SectionHeading eyebrow={about.eyebrow} title={about.heading}>
        {about.description}
      </SectionHeading>

      <div className="about-grid">
        {about.cards.map((card) => (
          <article className="card reveal" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default About;
