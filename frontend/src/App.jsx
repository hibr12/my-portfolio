import { lazy, Suspense, useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initAnalytics } from './hooks/useAnalytics.js';
import LoadingScreen from './components/LoadingScreen.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const About = lazy(() => import('./pages/About.jsx'));
const Certificates = lazy(() => import('./pages/Certificates.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Footer = lazy(() => import('./components/Footer.jsx'));
const Hero = lazy(() => import('./pages/Hero.jsx'));
const Navbar = lazy(() => import('./components/Navbar.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Skills = lazy(() => import('./pages/Skills.jsx'));

import { AuthProvider } from './context/AuthContext.jsx';
import { DataProvider, useData } from './context/DataContext.jsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';

const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute.jsx'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout.jsx'));
const Login = lazy(() => import('./pages/admin/Login.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const ProjectsAdmin = lazy(() => import('./pages/admin/ProjectsAdmin.jsx'));
const SkillsAdmin = lazy(() => import('./pages/admin/SkillsAdmin.jsx'));
const CertificatesAdmin = lazy(() => import('./pages/admin/CertificatesAdmin.jsx'));
const MessagesAdmin = lazy(() => import('./pages/admin/MessagesAdmin.jsx'));
const AnalyticsAdmin = lazy(() => import('./pages/admin/AnalyticsAdmin.jsx'));
const SettingsAdmin = lazy(() => import('./pages/admin/SettingsAdmin.jsx'));

function SectionFallback({ name }) {
  return (
    <section className="section" aria-label={`Loading ${name}...`}>
      <div className="section-loading" role="status">
        <div className="section-loading__spinner" />
        <p style={{ color: 'var(--muted)', fontWeight: 700 }}>Loading {name}...</p>
      </div>
    </section>
  );
}

function HeroFallback() {
  return (
    <section className="hero section hero--fullwidth" aria-label="Loading hero...">
      <div className="hero__workspace-bg" aria-hidden="true" />
      <div className="hero__overlay">
        <div className="hero__content">
          <p className="eyebrow">Hello, I am</p>
          <h1 className="hero-skeleton">Loading...</h1>
          <h2 className="hero-skeleton">Loading...</h2>
          <p className="hero-skeleton">Loading bio...</p>
          <div className="hero__actions">
            <div className="hero-skeleton button-skeleton" />
            <div className="hero-skeleton button-skeleton" />
          </div>
        </div>
        <div className="hero__visual">
          <div className="profile-panel">
            <div className="hero-skeleton avatar-skeleton" />
            <div className="hero-skeleton text-skeleton" />
            <div className="hero-skeleton text-skeleton" />
            <div className="profile-panel__stats">
              <span className="hero-skeleton stat-skeleton" />
              <span className="hero-skeleton stat-skeleton" />
              <span className="hero-skeleton stat-skeleton" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NavbarFallback() {
  return (
    <header className="navbar" role="banner">
      <div className="navbar__brand" style={{ background: 'var(--primary)' }}>H</div>
      <nav className="navbar__links" aria-label="Main navigation">
        <span className="hero-skeleton nav-skeleton" />
        <span className="hero-skeleton nav-skeleton" />
        <span className="hero-skeleton nav-skeleton" />
        <span className="hero-skeleton nav-skeleton" />
        <span className="hero-skeleton nav-skeleton" />
        <span className="hero-skeleton nav-skeleton" />
      </nav>
      <div className="navbar__actions">
        <span className="hero-skeleton button-skeleton" />
      </div>
    </header>
  );
}

function FooterFallback() {
  return (
    <footer className="footer" role="contentinfo">
      <div>
        <strong className="hero-skeleton">Loading...</strong>
        <p className="hero-skeleton">Loading...</p>
        <p className="hero-skeleton">Loading...</p>
      </div>
      <div className="footer__links">
        <span className="hero-skeleton nav-skeleton" />
        <span className="hero-skeleton nav-skeleton" />
      </div>
    </footer>
  );
}

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
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <SeoUpdater />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Suspense fallback={<NavbarFallback />}>
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
      </Suspense>
      <main id="main-content" role="main">
        <Suspense fallback={<HeroFallback />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<SectionFallback name="About" />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionFallback name="Projects" />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionFallback name="Skills" />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<SectionFallback name="Certificates" />}>
          <Certificates />
        </Suspense>
        <Suspense fallback={<SectionFallback name="Contact" />}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={<FooterFallback />}>
        <Footer />
      </Suspense>
    </>
  );
}

function AnalyticsInit() {
  useEffect(() => {
    initAnalytics();
  }, []);
  return null;
}

function AdminFallback() {
  return (
    <div className="admin-loading" role="status" aria-label="Loading admin panel">
      <div className="admin-loading__spinner" />
      <p style={{ color: 'var(--muted)', fontWeight: 700 }}>Loading...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <DataProvider>
          <AuthProvider>
            <LoadingScreen />
            <AnalyticsInit />
            <ErrorBoundary>
              <Suspense fallback={<AdminFallback />}>
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
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
