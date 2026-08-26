import { useRef } from 'react';

function Desk({ colors }) {
  const groupRef = useRef();

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Desktop surface */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.08, 1.1]} />
        <meshStandardMaterial color={colors.deskSurface} roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Front-left leg */}
      <mesh position={[-1.05, 0.37, 0.45]} castShadow>
        <boxGeometry args={[0.06, 0.75, 0.06]} />
        <meshStandardMaterial color={colors.deskLeg} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Front-right leg */}
      <mesh position={[1.05, 0.37, 0.45]} castShadow>
        <boxGeometry args={[0.06, 0.75, 0.06]} />
        <meshStandardMaterial color={colors.deskLeg} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Back-left leg */}
      <mesh position={[-1.05, 0.37, -0.45]} castShadow>
        <boxGeometry args={[0.06, 0.75, 0.06]} />
        <meshStandardMaterial color={colors.deskLeg} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Back-right leg */}
      <mesh position={[1.05, 0.37, -0.45]} castShadow>
        <boxGeometry args={[0.06, 0.75, 0.06]} />
        <meshStandardMaterial color={colors.deskLeg} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, 0.81, 0.2]} castShadow>
        <boxGeometry args={[0.5, 0.02, 0.18]} />
        <meshStandardMaterial color={colors.keyboard} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Mouse */}
      <mesh position={[0.4, 0.81, 0.22]} castShadow>
        <boxGeometry args={[0.06, 0.03, 0.1]} />
        <meshStandardMaterial color={colors.mouse} roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

export default Desk;
