import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CameraController() {
  const { camera } = useThree();
  const startPos = useRef(new THREE.Vector3(0, 2.2, 4.5));
  const midPos = useRef(new THREE.Vector3(0.5, 1.8, 3));
  const endPos = useRef(new THREE.Vector3(0.3, 1.2, 2));
  const targetPos = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3(0, 2.2, 4.5));
  const reducedMotion = useRef(false);
  const lookTarget = useRef(new THREE.Vector3(0, 0.8, 0));
  const cachedHero = useRef(null);
  const cachedViewport = useRef(0);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateCached = () => {
      const hero = document.getElementById('home');
      if (hero) {
        cachedHero.current = hero;
        cachedViewport.current = window.innerHeight;
      }
    };
    updateCached();
    window.addEventListener('resize', updateCached, { passive: true });
    return () => window.removeEventListener('resize', updateCached);
  }, []);

  useFrame(() => {
    if (reducedMotion.current) return;

    const hero = cachedHero.current;
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const heroHeight = rect.height;
    const viewportHeight = cachedViewport.current;

    const progress = Math.max(0, Math.min(1,
      (viewportHeight - rect.top) / (viewportHeight + heroHeight)
    ));

    if (progress < 0.5) {
      const p = progress / 0.5;
      targetPos.current.copy(startPos.current).lerp(midPos.current, p);
    } else {
      const p = (progress - 0.5) / 0.5;
      targetPos.current.copy(midPos.current).lerp(endPos.current, p);
    }

    currentPos.current.lerp(targetPos.current, 0.04);
    camera.position.copy(currentPos.current);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

export default CameraController;
