import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import { useKeyboardControls } from "@react-three/drei"
import { useRef } from "react"

const Player = () => {
    const body = useRef()
    const [ subscribeKeys, getKeys ] = useKeyboardControls()

    useFrame((state, delta) => {
        const keys = getKeys()
        const { forward, backward, leftward, rightward } = keys;

        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)
    })

  return <RigidBody 
            ref={body}
            position={[ 0, 1, 0 ]}
            colliders='ball'
            restitution={0.2}
            friction={1}
        >
        <mesh castShadow >
            <icosahedronGeometry args={[ 0.3, 1 ]} />
            <meshStandardMaterial flatShading color='mediumpurple' />
        </mesh>
    </RigidBody>
}

export default Player