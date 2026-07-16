import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext.jsx';

function Navbar({ theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useData();
  const navLinks = settings.navigation?.links || [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Certificates', href: '#certificates' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => setIsOpen(false);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <a className="navbar__brand" href="#home" onClick={handleNavClick}>
        {settings.hero?.name?.split(' ')[0] || 'Hibru'}
      </a>

      <nav className={`navbar__links ${isOpen ? 'navbar__links--open' : ''}`} aria-label="Main menu">
        {navLinks.map((link) => (
          <a key={link.label} href={link.href} onClick={handleNavClick}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="navbar__actions">
        <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label="Toggle color theme">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        <button
          className={`menu-button ${isOpen ? 'menu-button--open' : ''}`}
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
