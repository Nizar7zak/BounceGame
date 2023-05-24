const BlockStart = () => {
  return (
    <mesh position={[ 0, -0.1, 0 ]}>
        <boxGeometry args={[ 4, 0.2, 4 ]} />
        <meshStandardMaterial color='limegreen' />
    </mesh>
  )
}

export default BlockStart