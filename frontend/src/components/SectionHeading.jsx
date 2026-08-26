import { memo, useMemo } from 'react';
import { useInView } from '../hooks/useInView.js';

const SECTION_HEADING_DIRECTIONS = [
  'reveal-slide-left',
  'reveal-slide-right',
  'reveal-slide-up',
  'reveal-scale',
];

function getSectionHeadingDirection(delay) {
  return SECTION_HEADING_DIRECTIONS[delay % SECTION_HEADING_DIRECTIONS.length];
}

const SectionHeading = memo(function SectionHeading({ eyebrow, title, children, delay = 0 }) {
  const [ref, isInView] = useInView();
  const directionClass = useMemo(() => getSectionHeadingDirection(delay), [delay]);

  return (
    <div
      ref={ref}
      className={`section-heading ${directionClass} ${delay ? `reveal-delay-${delay}` : ''} ${isInView ? 'is-visible' : ''}`}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={`${eyebrow?.toLowerCase()}-heading`}>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
});

export default SectionHeading;
