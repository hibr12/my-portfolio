import { memo, useCallback, useEffect, useState, useMemo } from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import { useData } from '../context/DataContext.jsx';
import { useInView } from '../hooks/useInView.js';

const CERT_ENTRANCE_DIRECTIONS = [
  'reveal-slide-left',
  'reveal-slide-right',
  'reveal-slide-up',
  'reveal-scale',
  'reveal-flip-x',
];

function getCertDirection(index) {
  return CERT_ENTRANCE_DIRECTIONS[index % CERT_ENTRANCE_DIRECTIONS.length];
}

const CertificateCard = memo(function CertificateCard({ certificate, index, onSelect }) {
  const [ref, isInView] = useInView();
  const directionClass = useMemo(() => getCertDirection(index), [index]);

  return (
    <article
      ref={ref}
      className={`card certificate-card certificate-card-3d ${directionClass} reveal-delay-${index + 1} ${isInView ? 'is-visible' : ''}`}
      key={certificate.id || certificate.title}
    >
      <span>{certificate.year}</span>
      <h3>{certificate.title}</h3>
      <p>{certificate.issuer}</p>
      <button type="button" onClick={() => onSelect(certificate)}>
        View Certificate
      </button>
    </article>
  );
});

const Certificates = memo(function Certificates() {
  const { certificates } = useData();
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [sectionRef, sectionInView] = useInView({ threshold: 0.1 });

  const handleClose = useCallback(() => setActiveCertificate(null), []);

  useEffect(() => {
    if (!activeCertificate) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveCertificate(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCertificate]);

  return (
    <section ref={sectionRef} className={`section section--tinted ${sectionInView ? 'is-visible' : ''}`} id="certificates" aria-labelledby="certificates-heading">
      <SectionHeading eyebrow="Certificates" title="Learning milestones">
        Courses and certificates that support my foundation in web development and mobile app development.
      </SectionHeading>

      <div className="certificates-grid perspective-container">
        {certificates.map((certificate, index) => (
          <CertificateCard
            certificate={certificate}
            index={index}
            onSelect={setActiveCertificate}
            key={certificate.id || certificate.title}
          />
        ))}
      </div>

      {activeCertificate && (
        <div
          className="certificate-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeCertificate.title} certificate`}
          onClick={handleClose}
        >
          <div className="certificate-viewer__panel" onClick={(event) => event.stopPropagation()}>
            <button
              className="certificate-viewer__close"
              type="button"
              aria-label="Close certificate viewer"
              onClick={handleClose}
            >
              Close
            </button>
            <img
              src={activeCertificate.image}
              alt={`${activeCertificate.title} certificate`}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      )}
    </section>
  );
});

export default Certificates;
