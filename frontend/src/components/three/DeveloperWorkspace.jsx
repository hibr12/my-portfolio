import { memo, Suspense, useCallback, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import Room from './workspace/Room';
import Desk from './workspace/Desk';
import Chair from './workspace/Chair';
import Developer from './workspace/Developer';
import Laptop from './workspace/Laptop';
import Monitor from './workspace/Monitor';
import Lamp from './workspace/Lamp';
import Books from './workspace/Books';
import Plant from './workspace/Plant';
import Phone from './workspace/Phone';
import InteractiveObject from './workspace/InteractiveObject';
import CameraController from './CameraController';
import WorkspaceLoadingScreen from './workspace/WorkspaceLoadingScreen';
import { useThemeColors } from '../../context/ThemeContext.jsx';

const SceneContent = memo(function SceneContent() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  const colors = useThemeColors();

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsLowEnd(width < 768 || navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4);
    };
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const shadowMapSize = isLowEnd ? 256 : (isMobile ? 512 : 1024);
  const dpr = isLowEnd ? 1 : [1, 1.5];

  return (
    <>
      <CameraController />

      <ambientLight intensity={colors.ambientLight} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={colors.directionalLight}
        castShadow={!isMobile && !isLowEnd}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <pointLight position={[-3, 3, 2]} intensity={colors.pointLight1Intensity} color={colors.pointLight1Color} />
      <pointLight position={[0, 0.8, -1]} intensity={colors.pointLight2Intensity} color={colors.pointLight2Color} />

      <Room colors={colors} />
      <Desk colors={colors} />
      <Chair colors={colors} />

      <InteractiveObject
        position={[0, 0, 0.9]}
        rotation={[0, Math.PI, 0]}
        label="About Me"
        href="#about"
        isMobile={isMobile}
      >
        <Developer colors={colors} />
      </InteractiveObject>

      <InteractiveObject
        position={[-0.2, 0.81, -0.05]}
        rotation={[0, 0.1, 0]}
        label="My Projects"
        href="#projects"
        isMobile={isMobile}
      >
        <Laptop colors={colors} />
      </InteractiveObject>

      <Monitor colors={colors} />
      <Lamp colors={colors} />

      <InteractiveObject
        position={[1.0, 0.79, 0.15]}
        label="Skills"
        href="#skills"
        isMobile={isMobile}
      >
        <Books colors={colors} />
      </InteractiveObject>

      <Plant colors={colors} />

      <InteractiveObject
        position={[0.7, 0.81, 0.25]}
        rotation={[0, -0.3, 0]}
        label="Contact Me"
        href="#contact"
        isMobile={isMobile}
      >
        <Phone colors={colors} />
      </InteractiveObject>

      {!isMobile && !isLowEnd && (
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.35}
          scale={8}
          blur={2.5}
          far={4}
        />
      )}
    </>
  );
});

function DeveloperWorkspace() {
  const colors = useThemeColors();
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    setIsLowEnd(
      window.innerWidth < 768 ||
      navigator.hardwareConcurrency <= 4 ||
      navigator.deviceMemory <= 4
    );
  }, []);

  const dpr = isLowEnd ? 1 : [1, 1.5];

  return (
    <Canvas
      camera={{ position: [0, 2.2, 4.5], fov: 45, near: 0.1, far: 20 }}
      shadows={!isLowEnd}
      dpr={dpr}
      gl={{ antialias: !isLowEnd, alpha: false, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
      onCreated={({ gl }) => {
        gl.setClearColor(colors.clearColor);
      }}
    >
      <Suspense fallback={<WorkspaceLoadingScreen />}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}

export default memo(DeveloperWorkspace);
