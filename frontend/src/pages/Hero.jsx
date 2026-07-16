import { lazy, Suspense } from 'react';
import { useData } from '../context/DataContext.jsx';

const Hero3DScene = lazy(() => import('../components/three/Hero3DScene.jsx'));

function Hero3DFallback() {
  return <div className="hero__3d-fallback" />;
}

function Hero() {
  const { settings } = useData();
  const { hero } = settings;

  return (
    <section className="hero section" id="home">
      <div className="hero__content reveal">
        <p className="eyebrow">Hello, I am </p>
        <h1>{hero.name}</h1>
        <h2>{hero.title}</h2>
        <p>{hero.bio}</p>
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
        <div className="hero__3d-container">
          <Suspense fallback={<Hero3DFallback />}>
            <Hero3DScene />
          </Suspense>
        </div>
        <div className="profile-panel">
          <img
            className="profile-panel__avatar"
            src={hero.avatar}
            alt={hero.name}
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
    </section>
  );
}

export default Hero;
