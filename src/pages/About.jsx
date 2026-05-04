import SectionHeading from '../components/SectionHeading.jsx';

function About() {
  return (
    <section className="section" id="about">
      <SectionHeading eyebrow="About" title="Building practical software while learning deeply">
        I am a Computer Science student at Bahir Dar University with strong interest in full-stack
        development and mobile app development. I enjoy building real-world applications and solving problems using technology.
      </SectionHeading>

      <div className="about-grid">
        <article className="card reveal">
          <h3>Education</h3>
          <p>
            Studying core computer science subjects including data structures and algorithms, database
            systems, software engineering,andriod app development and web development.
          </p>
        </article>
        <article className="card reveal">
          <h3>Goals</h3>
          <p>
            My goal is to become a capable full-stack developer who can design, build, and maintain
            reliable applications for real users.
          </p>
        </article>
        <article className="card reveal">
          <h3>Focus</h3>
          <p>
            I am currently improving my React, Node.js, REST API, MySQL, and MongoDB skills through
            hands-on portfolio projects.
          </p>
        </article>
      </div>
    </section>
  );
}

export default About;
