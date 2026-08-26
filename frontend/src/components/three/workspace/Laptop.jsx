import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Laptop({ colors }) {
  const screenLightRef = useRef();

  useFrame((state) => {
    if (screenLightRef.current) {
      screenLightRef.current.intensity = 0.6 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
    }
  });

  return (
    <>
      {/* Base */}
      <mesh castShadow>
        <boxGeometry args={[0.38, 0.02, 0.26]} />
        <meshStandardMaterial color={colors.laptopBody} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, 0.011, 0.06]}>
        <boxGeometry args={[0.12, 0.002, 0.08]} />
        <meshStandardMaterial color={colors.laptopBody} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Screen - tilted back */}
      <group position={[0, 0.02, -0.12]} rotation={[-0.35, 0, 0]}>
        {/* Screen bezel */}
        <mesh position={[0, 0.14, 0]} castShadow>
          <boxGeometry args={[0.36, 0.26, 0.015]} />
          <meshStandardMaterial color={colors.laptopBody} roughness={0.3} metalness={0.6} />
        </mesh>

        {/* Screen display */}
        <mesh position={[0, 0.14, 0.009]}>
          <boxGeometry args={[0.32, 0.22, 0.001]} />
          <meshStandardMaterial
            color={colors.laptopScreen}
            emissive={colors.laptopScreen}
            emissiveIntensity={0.8}
            roughness={0.05}
          />
        </mesh>

        {/* Code lines on screen */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[-0.08 + i * 0.02, 0.08 + i * 0.025, 0.01]}>
            <boxGeometry args={[0.15 - i * 0.01, 0.008, 0.001]} />
            <meshStandardMaterial
              color={colors.monitorCode1}
              emissive={colors.monitorCode1}
              emissiveIntensity={0.4}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* Screen light glow */}
      <pointLight
        ref={screenLightRef}
        position={[0, 0.2, 0.15]}
        intensity={0.6}
        color={colors.monitorCode1}
        distance={2}
        decay={2}
      />
    </>
  );
}

export default Laptop;
