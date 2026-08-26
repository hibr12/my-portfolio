import { memo, lazy, Suspense, useState, useEffect } from 'react';
import { useData } from '../context/DataContext.jsx';
import { useInView } from '../hooks/useInView.js';

const DeveloperWorkspace = lazy(() => import('../components/three/DeveloperWorkspace.jsx'));

function Hero3DFallback() {
  return <div className="hero__3d-fallback" aria-hidden="true" />;
}

const Hero = memo(function Hero() {
  const { settings } = useData();
  const { hero } = settings;
  const [contentRef, contentInView] = useInView({ threshold: 0.1 });
  const [visualRef, visualInView] = useInView({ threshold: 0.1 });
  const [sectionRef, sectionInView] = useInView({ threshold: 0.1 });

  // Force hero to be visible immediately since it's the first section
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => { setHeroVisible(true); }, []);

  return (
    <section ref={sectionRef} className={`hero section hero--fullwidth ${sectionInView || heroVisible ? 'is-visible' : ''}`} id="home" aria-label="Introduction">
      <div className="hero__workspace-bg" aria-hidden="true">
        <Suspense fallback={<Hero3DFallback />}>
          <DeveloperWorkspace />
        </Suspense>
      </div>

      <div className="hero__overlay">
        <div
          ref={contentRef}
          className={`hero__content reveal-slide-up ${contentInView ? 'is-visible' : ''}`}
        >
          <p className={`eyebrow reveal-slide-left reveal-delay-hero-1 ${contentInView ? 'is-visible' : ''}`}>
            Hello, I am{' '}
          </p>
          <h1 className={`reveal-slide-up reveal-delay-hero-2 ${contentInView ? 'is-visible' : ''}`}>
            {hero.name}
          </h1>
          <h2 className={`reveal-slide-left reveal-delay-hero-3 ${contentInView ? 'is-visible' : ''}`}>
            {hero.title}
          </h2>
          <p className={`reveal-slide-right reveal-delay-hero-4 ${contentInView ? 'is-visible' : ''}`}>
            {hero.bio}
          </p>
          <div className={`hero__actions reveal-scale reveal-delay-hero-5 ${contentInView ? 'is-visible' : ''}`}>
            <a className="button button--primary" href="#projects">
              View Projects
            </a>
            <a className="button button--secondary" href="#contact">
              Contact Me
            </a>
          </div>
        </div>

        <div
          ref={visualRef}
          className={`hero__visual reveal-slide-right ${visualInView ? 'is-visible' : ''}`}
          aria-label="Developer profile summary"
        >
          <div className={`profile-panel profile-panel-3d ${visualInView ? 'is-visible' : ''}`}>
            <img
              className="profile-panel__avatar"
              src={hero.avatar}
              alt={`Photo of ${hero.name}`}
              width="176"
              height="176"
              loading="eager"
              decoding="async"
            />
            <div>
              <span>{hero.title.split(' at ')[0]}</span>
              <strong>React + Node.js</strong>
            </div>
            <div className="profile-panel__stats">
              {hero.stats.map((stat) => (
                <span key={stat}>{stat}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
