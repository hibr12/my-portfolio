import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useData } from '../context/DataContext.jsx';

const LoadingScreen = memo(function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef(null);
  const { loading } = useData();

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          setTimeout(hide, 300);
          return 100;
        }
        return prev + Math.random() * 18 + 7;
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hide]);

  // Hide loading screen when data is loaded (or after minimum time)
  useEffect(() => {
    if (!loading) {
      // Ensure minimum display time
      setProgress(100);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      className="loading-screen"
      style={{ opacity: progress >= 100 ? 0 : 1, transition: 'opacity 300ms ease' }}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="loading-screen__content">
        <div className="loading-screen__brand">H</div>
        <div
          className="loading-screen__bar"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
        <p className="loading-screen__text">Loading portfolio...</p>
      </div>
    </div>
  );
});

export default LoadingScreen;
