import { memo, useEffect, useState } from 'react';

const NavigationProgress = memo(function NavigationProgress({ isNavigating, targetSection }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isNavigating) {
      setVisible(true);
      let progressValue = 0;
      const interval = setInterval(() => {
        progressValue += Math.random() * 15 + 5;
        if (progressValue >= 90) {
          progressValue = 90;
          clearInterval(interval);
        }
        setProgress(progressValue);
      }, 50);
      return () => clearInterval(interval);
    } else if (visible && progress >= 90) {
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
    }
  }, [isNavigating, visible, progress]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="navigation-progress"
      style={{
        width: `${Math.min(progress, 100)}%`,
        opacity: visible ? 1 : 0,
        transition: 'width 200ms ease-out, opacity 200ms ease-out',
      }}
      aria-hidden="true"
    />
  );
});

export default NavigationProgress;