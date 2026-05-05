function Hero() {
  return (
    <section className="hero section" id="home">
      <div className="hero__content reveal">
        <p className="eyebrow">Available for internships and junior projects</p>
        <h1>hibru yitayew</h1>
        <h2>Computer Science Student</h2>
        <p>
          I am a passionate Computer Science student focused on building modern web and mobile
          applications using React, Node.js, and databases.
        </p>
        <div className="hero__actions">
          <a className="button button--primary" href="#projects">
            View Projects
          </a>
          <a className="button button--secondary" href="#contact">
            Contact Me
          </a>
        </div>
      </div>

      <div className="hero__visual reveal" aria-label="Developer profile summary">
        <div className="profile-panel">
          <img
            className="profile-panel__avatar"
            src="/assets/image/hib2.jpg"
            alt="Hibru Yitayew"
          />
          <div>
            <span>Full-stack learner</span>
            <strong>React + Node.js</strong>
          </div>
          <div className="profile-panel__stats">
            <span>5 Projects</span>
            <span>3 Certificates</span>
            <span>BDU Student</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
