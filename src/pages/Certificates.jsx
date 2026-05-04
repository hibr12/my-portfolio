import SectionHeading from '../components/SectionHeading.jsx';
import { useEffect, useState } from 'react';

function Certificates({ certificates }) {
  const [activeCertificate, setActiveCertificate] = useState(null);

  useEffect(() => {
    if (!activeCertificate) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveCertificate(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCertificate]);

  return (
    <section className="section section--tinted" id="certificates">
      <SectionHeading eyebrow="Certificates" title="Learning milestones">
        Courses and certificates that support my foundation in web development and mobile app development.
      </SectionHeading>

      <div className="certificates-grid">
        {certificates.map((certificate) => (
          <article className="card certificate-card reveal" key={certificate.title}>
            <span>{certificate.year}</span>
            <h3>{certificate.title}</h3>
            <p>{certificate.issuer}</p>
            <button type="button" onClick={() => setActiveCertificate(certificate)}>
              View Certificate
            </button>
          </article>
        ))}
      </div>

      {activeCertificate && (
        <div
          className="certificate-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeCertificate.title} certificate`}
          onClick={() => setActiveCertificate(null)}
        >
          <div className="certificate-viewer__panel" onClick={(event) => event.stopPropagation()}>
            <button
              className="certificate-viewer__close"
              type="button"
              aria-label="Close certificate"
              onClick={() => setActiveCertificate(null)}
            >
              Close
            </button>
            <img src={activeCertificate.image} alt={`${activeCertificate.title} certificate`} />
          </div>
        </div>
      )}
    </section>
  );
}

export default Certificates;
