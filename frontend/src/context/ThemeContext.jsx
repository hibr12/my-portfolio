import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('portfolio-theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = useMemo(
    () => () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    []
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {
      // Storage full or unavailable
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useThemeColors() {
  const { theme } = useTheme();
  const colors = useMemo(() => {
    if (theme === 'light') {
      return {
        bg: '#f7f9fc',
        surface: '#ffffff',
        surfaceStrong: '#edf3f8',
        text: '#172033',
        muted: '#5d6877',
        line: 'rgba(23, 32, 51, 0.12)',
        primary: '#087f75',
        primaryStrong: '#06685f',
        accent: '#c87912',
        shadow: '0 18px 45px rgba(26, 36, 57, 0.12)',
        roomFloor: '#e8ebf0',
        roomWall: '#f0f3f7',
        roomCeiling: '#f7f9fc',
        deskSurface: '#d4c4b8',
        deskLeg: '#b8a08c',
        keyboard: '#d0d4d8',
        mouse: '#c0c4c8',
        monitorBody: '#e0e4e8',
        monitorScreen: '#d0d8e0',
        monitorCode1: '#087f75',
        monitorCode2: '#c87912',
        chairBase: '#c0c4c8',
        chairSeat: '#d0d4d8',
        lampBase: '#c0c4c8',
        lampShade: '#f0f3f7',
        plantPot: '#d4c4b8',
        plantLeaf: '#7aa87a',
        bookCover1: '#087f75',
        bookCover2: '#c87912',
        bookCover3: '#172033',
        laptopBody: '#c0c4c8',
        laptopScreen: '#d0d8e0',
        phoneBody: '#c0c4c8',
        phoneScreen: '#d0d8e0',
        developerShirt: '#087f75',
        developerPants: '#172033',
        windowGlass: '#c8d8e8',
        windowFrame: '#a0a8b0',
        rug: '#d0d4e0',
        ambientLight: 0.4,
        directionalLight: 0.8,
        pointLight1Color: '#087f75',
        pointLight1Intensity: 0.3,
        pointLight2Color: '#c87912',
        pointLight2Intensity: 0.2,
        clearColor: '#f7f9fc',
      };
    }
    return {
      bg: '#0d1117',
      surface: '#131a24',
      surfaceStrong: '#182233',
      text: '#f4f7fb',
      muted: '#a9b4c3',
      line: 'rgba(255, 255, 255, 0.1)',
      primary: '#3dd6c6',
      primaryStrong: '#21a89c',
      accent: '#f7b955',
      shadow: '0 22px 60px rgba(0, 0, 0, 0.28)',
      roomFloor: '#2a2a3a',
      roomWall: '#1e1e2e',
      roomWallSide: '#222233',
      roomCeiling: '#1a1a28',
      deskSurface: '#5c4033',
      deskLeg: '#4a3228',
      keyboard: '#2a2a2a',
      mouse: '#333',
      monitorBody: '#1a1a1a',
      monitorScreen: '#0d1f3c',
      monitorCode1: '#3dd6c6',
      monitorCode2: '#f7b955',
      chairBase: '#333',
      chairSeat: '#2a2a2a',
      lampBase: '#333',
      lampShade: '#444',
      plantPot: '#1a2a3a',
      plantLeaf: '#3dd6c6',
      bookCover1: '#3dd6c6',
      bookCover2: '#f7b955',
      bookCover3: '#f4f7fb',
      laptopBody: '#2a2a2a',
      laptopScreen: '#0d1f3c',
      phoneBody: '#2a2a2a',
      phoneScreen: '#0d1f3c',
      developerShirt: '#3dd6c6',
      developerPants: '#1a1a28',
      windowGlass: '#4a6fa5',
      windowFrame: '#555',
      rug: '#1a2a3a',
      ambientLight: 0.25,
      directionalLight: 0.7,
      pointLight1Color: '#3dd6c6',
      pointLight1Intensity: 0.3,
      pointLight2Color: '#f7b955',
      pointLight2Intensity: 0.2,
      clearColor: '#0d1117',
    };
  }, [theme]);

  return colors;
}