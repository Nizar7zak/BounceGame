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

        const impulseStrength = 0.6 * delta
        const torqueStrength = 0.2 * delta

        if(forward) {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }
        if(backward) {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        } 
        if(leftward) {
            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }
        if(rightward) {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }

        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)
    })

  return <RigidBody 
            ref={body}
            position={[ 0, 1, 0 ]}
            colliders='ball'
            restitution={0.2}
            friction={1}
            linearDamping={0.5}
            angularDamping={0.5}
        >
        <mesh castShadow >
            <icosahedronGeometry args={[ 0.3, 1 ]} />
            <meshStandardMaterial flatShading color='mediumpurple' />
        </mesh>
    </RigidBody>
}

export default Player