import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Developer({ colors }) {
  const headRef = useRef();

  // Subtle head movement
  useFrame((state) => {
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      headRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <>
      {/* Body / Torso - hoodie */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <capsuleGeometry args={[0.17, 0.35, 8, 12]} />
        <meshStandardMaterial color={colors.developerShirt} roughness={0.9} />
      </mesh>

      {/* Hoodie detail - front pocket */}
      <mesh position={[0, 1.0, 0.14]}>
        <boxGeometry args={[0.2, 0.08, 0.02]} />
        <meshStandardMaterial color={colors.developerShirt} roughness={0.9} />
      </mesh>

      {/* Head */}
      <group ref={headRef}>
        <mesh position={[0, 1.55, 0]} castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#c68642" roughness={0.8} />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 1.62, -0.02]} castShadow>
          <sphereGeometry args={[0.14, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      </group>

      {/* Left upper arm */}
      <mesh position={[-0.22, 1.18, 0.12]} rotation={[0.5, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.055, 0.2, 6, 8]} />
        <meshStandardMaterial color={colors.developerShirt} roughness={0.9} />
      </mesh>

      {/* Left forearm - on desk */}
      <mesh position={[-0.18, 0.9, 0.28]} rotation={[1.1, 0, 0.1]} castShadow>
        <capsuleGeometry args={[0.05, 0.18, 6, 8]} />
        <meshStandardMaterial color="#c68642" roughness={0.8} />
      </mesh>

      {/* Right upper arm */}
      <mesh position={[0.22, 1.18, 0.12]} rotation={[0.5, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.055, 0.2, 6, 8]} />
        <meshStandardMaterial color={colors.developerShirt} roughness={0.9} />
      </mesh>

      {/* Right forearm - on desk */}
      <mesh position={[0.18, 0.9, 0.28]} rotation={[1.1, 0, -0.1]} castShadow>
        <capsuleGeometry args={[0.05, 0.18, 6, 8]} />
        <meshStandardMaterial color="#c68642" roughness={0.8} />
      </mesh>

      {/* Left hand on keyboard */}
      <mesh position={[-0.12, 0.83, 0.22]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#c68642" roughness={0.8} />
      </mesh>

      {/* Right hand on mouse */}
      <mesh position={[0.35, 0.83, 0.24]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#c68642" roughness={0.8} />
      </mesh>

      {/* Legs (seated, extending forward under desk) */}
      <mesh position={[-0.08, 0.55, 0.55]} rotation={[0.8, 0, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.25, 6, 8]} />
        <meshStandardMaterial color={colors.developerPants} roughness={0.85} />
      </mesh>

      <mesh position={[0.08, 0.55, 0.55]} rotation={[0.8, 0, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.25, 6, 8]} />
        <meshStandardMaterial color={colors.developerPants} roughness={0.85} />
      </mesh>
    </>
  );
}

export default Developer;
