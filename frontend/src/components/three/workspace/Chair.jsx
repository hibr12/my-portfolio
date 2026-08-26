function Chair({ colors }) {
  return (
    <group position={[0, 0, 1.0]}>
      {/* Seat */}
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color={colors.chairSeat} roughness={0.8} />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.78, -0.22]} castShadow>
        <boxGeometry args={[0.48, 0.55, 0.05]} />
        <meshStandardMaterial color={colors.chairSeat} roughness={0.8} />
      </mesh>

      {/* Center pole */}
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.48, 8]} />
        <meshStandardMaterial color={colors.chairBase} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Base legs */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        const x = Math.cos(angle) * 0.25;
        const z = Math.sin(angle) * 0.25;
        return (
          <mesh key={i} position={[x, 0.03, z]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.06, 6]} />
            <meshStandardMaterial color={colors.chairBase} metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

export default Chair;
