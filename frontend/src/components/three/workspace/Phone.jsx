function Phone({ colors }) {
  return (
    <>
      {/* Phone body */}
      <mesh castShadow>
        <boxGeometry args={[0.07, 0.01, 0.14]} />
        <meshStandardMaterial color={colors.phoneBody} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0.006, 0]}>
        <boxGeometry args={[0.06, 0.001, 0.12]} />
        <meshStandardMaterial color={colors.phoneScreen} emissive={colors.phoneScreen} emissiveIntensity={0.5} roughness={0.1} />
      </mesh>
    </>
  );
}

export default Phone;
