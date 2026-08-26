function Books({ colors }) {
  const bookColors = [colors.bookCover1, colors.bookCover2, colors.bookCover3, colors.primary, colors.accent];

  return (
    <>
      {bookColors.map((color, i) => (
        <mesh
          key={i}
          position={[0, i * 0.04 + 0.02, 0]}
          rotation={[0, i * 0.05, 0]}
          castShadow
        >
          <boxGeometry args={[0.25, 0.035, 0.17]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}
    </>
  );
}

export default Books;
