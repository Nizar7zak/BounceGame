
const BlockStart = ({ position=[ 0, 0, 0 ], material, geometry }) => {
  return (
    <group position={position}>

        <mesh
            geometry={geometry}
            material={material}
            scale={[ 4, 0.2, 4 ]} 
            position={[ 0, -0.1, 0 ]}
            receiveShadow
        />

    </group>
  )
}

export default BlockStart