import { useEffect, useState } from 'react';

const navLinks = ['Home', 'About', 'Projects', 'Skills', 'Certificates', 'Contact'];

function Navbar({ theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        YN
      </a>

      <nav className={`navbar__links ${isOpen ? 'navbar__links--open' : ''}`} aria-label="Main menu">
        {navLinks.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`} onClick={handleNavClick}>
            {link}
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
