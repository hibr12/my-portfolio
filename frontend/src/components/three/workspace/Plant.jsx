function Plant({ colors }) {
  return (
    <group position={[1.0, 0.79, -0.3]}>
      {/* Pot */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.07, 0.16, 10]} />
        <meshStandardMaterial color={colors.plantPot} roughness={0.9} />
      </mesh>

      {/* Pot rim */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.02, 10]} />
        <meshStandardMaterial color={colors.plantPot} roughness={0.9} />
      </mesh>

      {/* Soil */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.01, 10]} />
        <meshStandardMaterial color="#3d2817" roughness={1} />
      </mesh>

      {/* Leaves - multiple at different angles */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const tilt = 0.3 + Math.random() * 0.3;
        const height = 0.2 + Math.random() * 0.15;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.05,
              0.2 + height / 2,
              Math.sin(angle) * 0.05,
            ]}
            rotation={[tilt * Math.cos(angle), angle, tilt * Math.sin(angle)]}
            castShadow
          >
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color={colors.plantLeaf} roughness={0.8} />
          </mesh>
        );
      })}

      {/* Stem */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 6]} />
        <meshStandardMaterial color={colors.plantLeaf} roughness={0.9} />
      </mesh>
    </group>
  );
}

export default Plant;
