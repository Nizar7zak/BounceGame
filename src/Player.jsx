import { RigidBody } from "@react-three/rapier"

const Player = () => {
  return (
    <RigidBody>
        <mesh castShadow >
            <icosahedronGeometry args={[ 0.3, 1 ]} />
            <meshStandardMaterial flatShading color='mediumpurple' />
        </mesh>
    </RigidBody>
  )
}

export default Player