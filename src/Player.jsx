import { useFrame } from '@react-three/fiber'
import { RigidBody, useRapier } from '@react-three/rapier'
import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import useGames from './stores/useGames'

const Player = () => {
    const body = useRef()
    const visualGroup = useRef()
    const prevYVel = useRef(0)
    const squash = useRef(0)

    const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())
    const shakeOffset = useRef(new THREE.Vector3())

    const start = useGames((state) => state.start)
    const end = useGames((state) => state.end)
    const blockCounts = useGames((state) => state.blockCount)
    const restart = useGames((state) => state.restart)

    const [subscribeKeys, getKeys] = useKeyboardControls()

    const { rapier, world } = useRapier()

    const jump = () => {
        const origin = body.current.translation()
        origin.y -= 0.31
        const direction = { x: 0, y: -1, z: 0 }

        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)

        if (hit && hit.timeOfImpact < 0.15) {
            body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
        }
    }

    const reset = () => {
        body.current.setTranslation({ x: 0, y: 1, z: 0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({ x: 0, y: 1, z: 0 })
        squash.current = 0
        if (visualGroup.current) {
            visualGroup.current.scale.set(1, 1, 1)
        }
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
        const keys = getKeys()
        const { forward, backward, leftward, rightward } = keys

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

        const bodyPosition = body.current.translation()
        const linvel = body.current.linvel()
        const yVel = linvel.y

        if (prevYVel.current < -2 && yVel > -0.5) {
            squash.current = 1
        }
        prevYVel.current = yVel

        squash.current = THREE.MathUtils.lerp(squash.current, 0, delta * 12)
        if (visualGroup.current) {
            const s = squash.current
            visualGroup.current.scale.set(
                1 + s * 0.15,
                1 - s * 0.3,
                1 + s * 0.15
            )
        }

        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 2.25
        cameraPosition.y += 0.65

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        const gameState = useGames.getState()
        let shake = gameState.hitShake
        if (shake > 0.01) {
            shake = shake * Math.exp(-4 * delta)
            useGames.setState({ hitShake: shake })
            shakeOffset.current.set(
                (Math.random() - 0.5) * shake * 0.15,
                (Math.random() - 0.5) * shake * 0.15,
                (Math.random() - 0.5) * shake * 0.15
            )
        } else {
            shakeOffset.current.set(0, 0, 0)
        }

        state.camera.position.copy(smoothedCameraPosition).add(shakeOffset.current)
        state.camera.lookAt(smoothedCameraTarget)

        if (bodyPosition.z < -(blockCounts * 4 + 2)) {
            end()
        }

        if (bodyPosition.y < -4) {
            restart()
        }
    })

    const football = useGLTF('./football.glb')

    useEffect(() => {
        football.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
                if (child.material) {
                    child.material.envMapIntensity = 0.85
                }
            }
        })
    }, [football])

    return (
        <RigidBody
            ref={body}
            position={[0, 1, 0]}
            colliders="ball"
            restitution={0.2}
            friction={1}
            linearDamping={0.5}
            angularDamping={0.5}
        >
            <group ref={visualGroup}>
                <primitive object={football.scene} scale={3.5} />
            </group>
        </RigidBody>
    )
}

export default Player
