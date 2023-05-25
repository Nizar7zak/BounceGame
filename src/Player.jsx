import { RigidBody } from "@react-three/rapier"

const Player = () => {
  return <RigidBody position={[ 0, 1, 0 ]} colliders='ball' restitution={0.2} friction={1} >
        <mesh castShadow >
            <icosahedronGeometry args={[ 0.3, 1 ]} />
            <meshStandardMaterial flatShading color='mediumpurple' />
        </mesh>
    </RigidBody>
}

export default Player