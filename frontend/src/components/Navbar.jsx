import { memo, useCallback, useEffect, useState } from 'react';
import { useData } from '../context/DataContext.jsx';
import { useSmoothScroll } from '../hooks/useSmoothScroll.js';
import NavigationProgress from './NavigationProgress.jsx';

const Navbar = memo(function Navbar({ theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isNavigating, setIsNavigating] = useState(false);
  const { settings } = useData();
  const navLinks = settings.navigation?.links || [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Certificates', href: '#certificates' },
    { label: 'Contact', href: '#contact' },
  ];
  const { scrollToSection } = useSmoothScroll();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 12);

          const sections = ['home', 'about', 'projects', 'skills', 'certificates', 'contact'];
          const scrollY = window.scrollY + 100;

          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
                setActiveSection(section);
                break;
              }
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((href) => {
    setIsOpen(false);
    const sectionId = href.replace('#', '');
    setIsNavigating(true);
    scrollToSection(sectionId);
    setTimeout(() => setIsNavigating(false), 800);
  }, [scrollToSection]);

  return (
    <>
      <NavigationProgress isNavigating={isNavigating} targetSection={activeSection} />
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
        <a className="navbar__brand" href="#home" onClick={() => handleNavClick('#home')} aria-label="Go to homepage">
          {settings.hero?.name?.split(' ')[0] || 'Hibru'}
        </a>

        <nav className={`navbar__links ${isOpen ? 'navbar__links--open' : ''}`} aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className={activeSection === link.href.replace('#', '') ? 'navbar__link--active' : ''}
              aria-current={activeSection === link.href.replace('#', '') ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button
            className={`menu-button ${isOpen ? 'menu-button--open' : ''}`}
            type="button"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
    </>
  );
});

export default Navbar;
