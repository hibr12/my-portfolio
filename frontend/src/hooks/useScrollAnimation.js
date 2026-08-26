import { useEffect, useRef, useState } from 'react';
import { useInView } from './useInView.js';

export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -40px 0px',
    triggerOnce = true,
    direction = 'up',
    delay = 0,
    duration = 0.7,
    easing = [0.16, 1, 0.3, 1],
  } = options;

  const [ref, isInView] = useInView({ threshold, rootMargin });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimated, delay]);

  const style = {
    opacity: hasAnimated ? 1 : 0,
    transform: hasAnimated
      ? 'translateY(0) scale(1) rotateX(0) rotateY(0)'
      : getInitialTransform(direction),
    transition: `opacity ${duration}s cubic-bezier(${easing.join(',')}), transform ${duration}s cubic-bezier(${easing.join(',')})`,
    willChange: 'opacity, transform',
  };

  return [ref, hasAnimated, style];
}

function getInitialTransform(direction) {
  switch (direction) {
    case 'up':
      return 'translateY(60px)';
    case 'down':
      return 'translateY(-60px)';
    case 'left':
      return 'translateX(-60px)';
    case 'right':
      return 'translateX(60px)';
    case 'scale':
      return 'scale(0.85)';
    case 'flip-x':
      return 'perspective(1000px) rotateX(-60deg)';
    case 'flip-y':
      return 'perspective(1000px) rotateY(-60deg)';
    default:
      return 'translateY(60px)';
  }
}

export function useStaggeredAnimation(itemCount, options = {}) {
  const { delay = 0.06, baseDelay = 0 } = options;
  const [ref, isInView] = useInView(options);
  const [animatedItems, setAnimatedItems] = useState(new Set());

  useEffect(() => {
    if (!isInView) return;

    const timers = [];
    for (let i = 0; i < itemCount; i++) {
      const itemDelay = baseDelay + i * delay;
      const timer = setTimeout(() => {
        setAnimatedItems((prev) => new Set([...prev, i]));
      }, itemDelay * 1000);
      timers.push(timer);
    }

    return () => timers.forEach(clearTimeout);
  }, [isInView, itemCount, delay, baseDelay]);

  const getItemStyle = (index, direction = 'up') => ({
    opacity: animatedItems.has(index) ? 1 : 0,
    transform: animatedItems.has(index)
      ? 'translateY(0) scale(1) rotateX(0) rotateY(0)'
      : getInitialTransform(direction),
    transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)`,
    willChange: 'opacity, transform',
  });

  return [ref, getItemStyle];
}

export function useParallax(speed = 0.3) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const distance = (viewportCenter - elementCenter) / viewportHeight;
      setOffset(distance * speed * 100);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return [ref, offset];
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollTop / docHeight);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}