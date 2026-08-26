import { useEffect, useRef, useState } from 'react';

export function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsInView(true);
      return;
    }

    const checkIntersection = () => {
      const rect = element.getBoundingClientRect();
      const rootMargin = options.rootMargin ?? '0px 0px -40px 0px';
      const margins = rootMargin.split(' ').map(v => parseInt(v) || 0);
      const [top, right, bottom, left] = margins;
      
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      const intersects = !(
        rect.bottom - bottom < 0 ||
        rect.top + top > viewportHeight ||
        rect.right - right < 0 ||
        rect.left + left > viewportWidth
      );
      
      if (intersects) {
        setIsInView(true);
        return true;
      }
      return false;
    };

    if (checkIntersection()) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return [ref, isInView];
}
