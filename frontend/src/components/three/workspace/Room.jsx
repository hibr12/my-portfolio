function Room({ colors }) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color={colors.roomFloor} roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2.2, -2.5]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color={colors.roomWall} roughness={0.95} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-4, 2.2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color={colors.roomWallSide} roughness={0.95} />
      </mesh>

      {/* Right wall */}
      <mesh position={[4, 2.2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color={colors.roomWallSide} roughness={0.95} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.4, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color={colors.roomCeiling} roughness={1} />
      </mesh>

      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0.8]} receiveShadow>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color={colors.rug} roughness={1} />
      </mesh>

      {/* Window on back wall */}
      <mesh position={[-2, 2.2, -2.48]}>
        <planeGeometry args={[1.2, 1.6]} />
        <meshStandardMaterial color={colors.windowGlass} emissive={colors.windowGlass} emissiveIntensity={0.4} roughness={0.1} metalness={0.3} />
      </mesh>

      {/* Window frame */}
      <mesh position={[-2, 2.2, -2.47]}>
        <boxGeometry args={[1.3, 0.04, 0.02]} />
        <meshStandardMaterial color={colors.windowFrame} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[-2, 2.2, -2.47]}>
        <boxGeometry args={[0.04, 1.7, 0.02]} />
        <meshStandardMaterial color={colors.windowFrame} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default Room;
