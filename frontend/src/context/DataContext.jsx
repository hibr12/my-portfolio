import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import { projects as fallbackProjects, skillGroups as fallbackSkillGroups, certificates as fallbackCertificates } from '../data/portfolioData.js';

const DataContext = createContext(null);

const defaultSettings = {
  hero: {
    name: 'Hibru Yitayew',
    title: 'Computer Science Student at Bahir Dar University',
    bio: 'I am a passionate Computer Science student focused on building modern web and mobile applications using React, Node.js, and databases.',
    avatar: '/assets/image/hib2.jpg',
    stats: ['Projects', 'Certificates', 'Passionate learner'],
  },
  about: {
    eyebrow: 'About',
    heading: 'Building practical software while learning deeply',
    description: 'I am a Computer Science student at Bahir Dar University with strong interest in full-stack development and mobile app development. I enjoy building real-world applications and solving problems using technology.',
    cards: [
      { title: 'Education', text: 'Studying core computer science subjects including data structures and algorithms, database systems, software engineering, android app development and web development.' },
      { title: 'Goals', text: 'My goal is to become a capable full-stack developer who can design, build, and maintain reliable applications for real users.' },
      { title: 'Focus', text: 'I am currently improving my React, Node.js, REST API, MySQL, and MongoDB skills through hands-on portfolio projects.' },
    ],
  },
  footer: {
    name: 'Hibru Yitayew',
    title: 'Computer Science Student',
    subtitle: 'at Bahir Dar University',
  },
  seo: {
    title: 'Hibru Yitayew | Computer Science Student',
    description: 'Personal portfolio for a Computer Science student focused on full-stack web and mobile app development.',
    keywords: ['portfolio', 'web developer', 'react', 'node.js', 'full-stack'],
  },
  contact: {
    email: '12hibr13@gmail.com',
    phone: '+251 926 673 294',
  },
  social: {
    github: 'https://github.com/hibr12',
    linkedin: '',
    twitter: '',
  },
  navigation: {
    links: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Projects', href: '#projects' },
      { label: 'Skills', href: '#skills' },
      { label: 'Certificates', href: '#certificates' },
      { label: 'Contact', href: '#contact' },
    ],
  },
};

export function DataProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [projects, setProjects] = useState(fallbackProjects);
  const [skillGroups, setSkillGroups] = useState(fallbackSkillGroups);
  const [certificates, setCertificates] = useState(fallbackCertificates);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      setError(null);
      const [settingsRes, projectsRes, skillsRes, certsRes] = await Promise.allSettled([
        api.getSettings(),
        api.getProjects(),
        api.getSkillGroups(),
        api.getCertificates(),
      ]);

      let hasAnyError = false;

      if (settingsRes.status === 'fulfilled' && settingsRes.value?.data) {
        setSettings((prev) => ({ ...prev, ...settingsRes.value.data }));
      } else if (settingsRes.status === 'rejected') {
        hasAnyError = true;
        console.warn('Failed to load settings:', settingsRes.reason);
      }

      if (projectsRes.status === 'fulfilled' && projectsRes.value?.data?.length > 0) {
        setProjects(projectsRes.value.data);
      } else if (projectsRes.status === 'rejected') {
        hasAnyError = true;
        console.warn('Failed to load projects:', projectsRes.reason);
      }

      if (skillsRes.status === 'fulfilled' && skillsRes.value?.data?.length > 0) {
        setSkillGroups(skillsRes.value.data);
      } else if (skillsRes.status === 'rejected') {
        hasAnyError = true;
        console.warn('Failed to load skills:', skillsRes.reason);
      }

      if (certsRes.status === 'fulfilled' && certsRes.value?.data?.length > 0) {
        setCertificates(certsRes.value.data);
      } else if (certsRes.status === 'rejected') {
        hasAnyError = true;
        console.warn('Failed to load certificates:', certsRes.reason);
      }

      if (hasAnyError) {
        setError('Some data could not be loaded from the server. Showing cached/fallback data.');
      }
    } catch (err) {
      setError('Failed to load data. Showing fallback data.');
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const value = useMemo(
    () => ({ settings, projects, skillGroups, certificates, loading, error, retry: loadAll }),
    [settings, projects, skillGroups, certificates, loading, error]
  );

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
