import { memo } from 'react';
import { useData } from '../context/DataContext.jsx';
import { useInView } from '../hooks/useInView.js';

const Footer = memo(function Footer() {
  const { settings } = useData();
  const { footer, social, contact } = settings;
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <footer ref={ref} className={`footer reveal-slide-up reveal-delay-1 ${isInView ? 'is-visible' : ''}`} role="contentinfo">
      <div>
        <strong>{footer.name}</strong>
        <p>{footer.title}</p>
        <p>{footer.subtitle}</p>
      </div>
      <div className="footer__links" aria-label="Social links">
        {social.github && (
          <a href={social.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        )}
        {social.linkedin && (
          <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        )}
        {social.twitter && (
          <a href={social.twitter} target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        )}
        {contact.phone && (
          <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
        )}
      </div>
      <p>Copyright &copy; {new Date().getFullYear()} {footer.name}. All rights reserved.</p>
    </footer>
  );
});

export default Footer;
