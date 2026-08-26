import { memo, useCallback, useState } from 'react';
import { Html } from '@react-three/drei';

const InteractiveObject = memo(function InteractiveObject({ children, label, href, position, rotation, isMobile }) {
  const [hovered, setHovered] = useState(false);

  const handlePointerOver = useCallback((e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (href) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [href]);

  return (
    <group
      position={position}
      rotation={rotation || [0, 0, 0]}
      onPointerOver={!isMobile ? handlePointerOver : undefined}
      onPointerOut={!isMobile ? handlePointerOut : undefined}
      onClick={handleClick}
    >
      {children}
      {hovered && (
        <Html position={[0, 0.5, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div className="workspace-tooltip">{label}</div>
        </Html>
      )}
    </group>
  );
});

export default InteractiveObject;
