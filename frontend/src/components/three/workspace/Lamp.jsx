import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Lamp({ colors }) {
  const lightRef = useRef();

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group position={[-0.9, 0.79, -0.3]}>
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.03, 12]} />
        <meshStandardMaterial color={colors.lampBase} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Arm */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.44, 6]} />
        <meshStandardMaterial color={colors.lampBase} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Shade */}
      <mesh position={[0, 0.48, 0]} castShadow>
        <coneGeometry args={[0.1, 0.12, 12, 1, true]} />
        <meshStandardMaterial color={colors.lampShade} roughness={0.9} side={2} />
      </mesh>

      {/* Light bulb glow */}
      <pointLight
        ref={lightRef}
        position={[0, 0.42, 0]}
        intensity={1.2}
        color="#ffd89e"
        distance={3}
        decay={2}
      />
    </group>
  );
}

export default Lamp;
