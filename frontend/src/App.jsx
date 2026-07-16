import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initAnalytics } from './hooks/useAnalytics.js';
import LoadingScreen from './components/LoadingScreen.jsx';
import About from './pages/About.jsx';
import Certificates from './pages/Certificates.jsx';
import Contact from './pages/Contact.jsx';
import Footer from './components/Footer.jsx';
import Hero from './pages/Hero.jsx';
import Navbar from './components/Navbar.jsx';
import Projects from './pages/Projects.jsx';
import Skills from './pages/Skills.jsx';

import { AuthProvider } from './context/AuthContext.jsx';
import { DataProvider, useData } from './context/DataContext.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import Login from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ProjectsAdmin from './pages/admin/ProjectsAdmin.jsx';
import SkillsAdmin from './pages/admin/SkillsAdmin.jsx';
import CertificatesAdmin from './pages/admin/CertificatesAdmin.jsx';
import MessagesAdmin from './pages/admin/MessagesAdmin.jsx';
import AnalyticsAdmin from './pages/admin/AnalyticsAdmin.jsx';
import SettingsAdmin from './pages/admin/SettingsAdmin.jsx';

function SeoUpdater() {
  const { settings } = useData();

  useEffect(() => {
    if (settings.seo?.title) {
      document.title = settings.seo.title;
    }
    if (settings.seo?.description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', settings.seo.description);
    }
  }, [settings.seo]);

  return null;
}

function Portfolio() {
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  return (
    <>
      <SeoUpdater />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <main id="main-content" role="main">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function AnalyticsInit() {
  useEffect(() => {
    initAnalytics();
  }, []);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AuthProvider>
          <LoadingScreen />
          <AnalyticsInit />
          <Routes>
            <Route path="/" element={<Portfolio />} />

            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectsAdmin />} />
              <Route path="skills" element={<SkillsAdmin />} />
              <Route path="certificates" element={<CertificatesAdmin />} />
              <Route path="contact" element={<MessagesAdmin />} />
              <Route path="analytics" element={<AnalyticsAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
            </Route>
          </Routes>
        </AuthProvider>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
