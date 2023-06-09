import { useFrame } from "@react-three/fiber"
import { RigidBody, useRapier } from "@react-three/rapier"
import { useGLTF, useKeyboardControls } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import * as THREE from 'three'
import useGames from "./stores/useGames"

const Player = () => {
    const body = useRef()
    const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

    const start = useGames((state) => state.start)
    const end = useGames((state) => state.end)
    const blockCounts = useGames((state) => state.blockCount)
    const restart = useGames((state) => state.restart)

    const [subscribeKeys, getKeys] = useKeyboardControls()

    const { rapier, world } = useRapier()
    const rapierWorld = world.raw()

    const jump = () => {
        const origin = body.current.translation()
        origin.y -= 0.31
        const direction = { x: 0, y: -1, z: 0 }

        const ray = new rapier.Ray(origin, direction)
        const hit = rapierWorld.castRay(ray, 10, true)

        if (hit.toi < 0.15) {
            body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
        }
    }

    const reset = () => {
        body.current.setTranslation({ x: 0, y: 1, z: 0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({ x: 0, y: 1, z: 0 })
    }

    useEffect(() => {
        const unsubscribeReset = useGames.subscribe(
            (state) => state.phase,
            (phase) => {

                if (phase === 'ready') {
                    reset()
                }
            }
        )

        const unsubscribeJump = subscribeKeys(
            (state) => state.jump,
            (value) => {
                if (value) {
                    jump()
                }
            }
        )

        const unsubscribeAny = subscribeKeys(() => {
            start()

        })

        return () => {
            unsubscribeJump()
            unsubscribeAny()
            unsubscribeReset()
        }
    }, [])

    useFrame((state, delta) => {
        /** 
        * Controls  
        **/
        const keys = getKeys()
        const { forward, backward, leftward, rightward } = keys;

        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const impulseStrength = 0.45 * delta
        const torqueStrength = 0.15 * delta

        if (forward) {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }
        if (backward) {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }
        if (leftward) {
            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }
        if (rightward) {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }

        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)

        /** 
        * Camera  
        **/
        const bodyPosition = body.current.translation()

        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 2.25
        cameraPosition.y += 0.65

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)

        /** 
         * Phases 
         **/
        if (bodyPosition.z < - (blockCounts * 4 + 2)) {
            end()
        }

        if (bodyPosition.y < -4) {
            restart()
        }
    })

    const football = useGLTF('./football.glb')

    return <RigidBody
        ref={body}
        position={[0, 1, 0]}
        colliders='ball'
        restitution={0.2}
        friction={1}
        linearDamping={0.5}
        angularDamping={0.5}
    >
        {/* <mesh castShadow >
            <icosahedronGeometry args={[0.3, 1]} />
            <meshStandardMaterial flatShading color='mediumpurple' />
        </mesh> */}
        <primitive object={football.scene} scale={3.5} />
    </RigidBody>
}

export default Player