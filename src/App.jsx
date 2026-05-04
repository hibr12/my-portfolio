import { useEffect, useState } from 'react';
import About from './pages/About.jsx';
import Certificates from './pages/Certificates.jsx';
import Contact from './pages/Contact.jsx';
import Footer from './components/Footer.jsx';
import Hero from './pages/Hero.jsx';
import Navbar from './components/Navbar.jsx';
import Projects from './pages/Projects.jsx';
import Skills from './pages/Skills.jsx';
import { certificates, projects, skillGroups } from './data/portfolioData.js';

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <>
      <Navbar theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <main>
        <Hero />
        <About />
        <Projects projects={projects} />
        <Skills skillGroups={skillGroups} />
        <Certificates certificates={certificates} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
