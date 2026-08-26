import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Monitor({ colors }) {
  const screenRef = useRef();

  useFrame((state) => {
    if (screenRef.current) {
      screenRef.current.emissiveIntensity = 0.6 + Math.sin(state.clock.elapsedTime * 1.2) * 0.1;
    }
  });

  return (
    <group position={[0.3, 0.79, -0.35]} rotation={[0, 0.05, 0]}>
      {/* Stand base */}
      <mesh position={[0, 0.01, 0.05]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.02, 16]} />
        <meshStandardMaterial color={colors.chairBase} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Stand arm */}
      <mesh position={[0, 0.22, 0.05]} castShadow>
        <boxGeometry args={[0.03, 0.4, 0.03]} />
        <meshStandardMaterial color={colors.chairBase} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Monitor body */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.7, 0.42, 0.025]} />
        <meshStandardMaterial color={colors.monitorBody} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0.55, 0.014]}>
        <boxGeometry args={[0.64, 0.36, 0.001]} />
        <meshStandardMaterial
          ref={screenRef}
          color={colors.monitorScreen}
          emissive={colors.monitorScreen}
          emissiveIntensity={0.6}
          roughness={0.05}
        />
      </mesh>

      {/* Code content on screen */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[-0.15, 0.42 + i * 0.05, 0.016]}>
          <boxGeometry args={[0.3 + i * 0.05, 0.012, 0.001]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? colors.monitorCode1 : colors.monitorCode2}
            emissive={i % 2 === 0 ? colors.monitorCode1 : colors.monitorCode2}
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

export default Monitor;
