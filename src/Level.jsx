import { Text, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import GlassPanel from './GlassPanel.jsx'
import GlassShards from './GlassShards.jsx'
import useGlassBreak from './useGlassBreak.js'
import {
  grassLight,
  grassDark,
  wallMaterial,
  lineMaterial,
  adBoardMaterial,
  seatMaterial,
  standBackMaterial,
  railingMaterial,
  fasciaMaterial,
} from './materials.js'

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const lineGeometry = new THREE.BoxGeometry(1, 1, 1)
const planeGeometry = new THREE.PlaneGeometry(1, 1)

const BlockStart = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={grassLight}
        scale={[4, 0.2, 4]}
        position={[0, -0.1, 0]}
        receiveShadow
      />
    </group>
  )
}

export const BlockSpinner = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef()
  const panelScale = [3.5, 0.3, 0.3]
  const glass = useGlassBreak(panelScale)

  const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1))
  useFrame((state) => {
    if (glass.broken) return

    const time = state.clock.elapsedTime
    const euler = new THREE.Euler(0, time * speed, 0)
    const rotation = new THREE.Quaternion()
    rotation.setFromEuler(euler)
    obstacle.current.setNextKinematicRotation(rotation)
  })

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={grassDark}
        scale={[4, 0.2, 4]}
        position={[0, -0.1, 0]}
        receiveShadow
      />

      <mesh geometry={lineGeometry} material={lineMaterial} scale={[0.1, 0.05, 4]} position={[2.1, 0, 0]} />
      <mesh geometry={lineGeometry} material={lineMaterial} scale={[0.1, 0.05, 4]} position={[-2.1, 0, 0]} />

      {!glass.broken && (
        <RigidBody
          ref={(ref) => {
            obstacle.current = ref
            glass.bodyRef.current = ref
          }}
          type="kinematicPosition"
          position={[0, 0.3, 0]}
          restitution={0.2}
          friction={0}
          colliders={false}
          onCollisionEnter={glass.onCollisionEnter}
        >
          <CuboidCollider ref={glass.colliderRef} args={[1.75, 0.15, 0.15]} />
          <GlassPanel scale={panelScale} breaking={glass.breaking} />
        </RigidBody>
      )}

      {glass.shards ? (
        <GlassShards
          origin={glass.shardOrigin}
          scale={panelScale}
          onDone={glass.clearShards}
        />
      ) : null}
    </group>
  )
}

export const BlockLimbo = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef()
  const panelScale = [3.5, 0.3, 0.3]
  const glass = useGlassBreak(panelScale)

  const [timeOffset] = useState(() => Math.random() * Math.PI * 2)
  useFrame((state) => {
    if (glass.broken) return

    const time = state.clock.elapsedTime
    const y = Math.sin(time + timeOffset) + 1.15
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    })
  })

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={grassDark}
        scale={[4, 0.2, 4]}
        position={[0, -0.1, 0]}
        receiveShadow
      />

      <mesh geometry={lineGeometry} material={lineMaterial} scale={[0.1, 0.05, 4]} position={[2.1, 0, 0]} />
      <mesh geometry={lineGeometry} material={lineMaterial} scale={[0.1, 0.05, 4]} position={[-2.1, 0, 0]} />

      {!glass.broken && (
        <RigidBody
          ref={(ref) => {
            obstacle.current = ref
            glass.bodyRef.current = ref
          }}
          type="kinematicPosition"
          position={[0, 0.3, 0]}
          restitution={0.2}
          friction={0}
          colliders={false}
          onCollisionEnter={glass.onCollisionEnter}
        >
          <CuboidCollider ref={glass.colliderRef} args={[1.75, 0.15, 0.15]} />
          <GlassPanel scale={panelScale} breaking={glass.breaking} />
        </RigidBody>
      )}

      {glass.shards ? (
        <GlassShards
          origin={glass.shardOrigin}
          scale={panelScale}
          onDone={glass.clearShards}
        />
      ) : null}
    </group>
  )
}

export const BlockAxe = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef()
  const panelScale = [1.5, 1.5, 0.3]
  const glass = useGlassBreak(panelScale)

  const [timeOffset] = useState(() => Math.random() * Math.PI * 2)
  useFrame((state) => {
    if (glass.broken) return

    const time = state.clock.elapsedTime
    const x = Math.sin(time + timeOffset) * 1.25
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    })
  })

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={grassDark}
        scale={[4, 0.2, 4]}
        position={[0, -0.1, 0]}
        receiveShadow
      />

      <mesh geometry={lineGeometry} material={lineMaterial} scale={[0.1, 0.05, 4]} position={[2.1, 0, 0]} />
      <mesh geometry={lineGeometry} material={lineMaterial} scale={[0.1, 0.05, 4]} position={[-2.1, 0, 0]} />

      {!glass.broken && (
        <RigidBody
          ref={(ref) => {
            obstacle.current = ref
            glass.bodyRef.current = ref
          }}
          type="kinematicPosition"
          position={[0, 0.3, 0]}
          restitution={0.2}
          friction={0}
          colliders={false}
          onCollisionEnter={glass.onCollisionEnter}
        >
          <CuboidCollider ref={glass.colliderRef} args={[0.75, 0.75, 0.15]} />
          <GlassPanel scale={panelScale} breaking={glass.breaking} />
        </RigidBody>
      )}

      {glass.shards ? (
        <GlassShards
          origin={glass.shardOrigin}
          scale={panelScale}
          onDone={glass.clearShards}
        />
      ) : null}
    </group>
  )
}

const BlockEnd = ({ position = [0, 0, 0] }) => {
  const hamburger = useGLTF('./hamburger.glb')
  const footballGoal = useGLTF('./footballGoal.glb')
  const goalLight = useRef()
  const goalTarget = useRef()

  hamburger.scene.children.forEach((mesh) => {
    mesh.castShadow = true
  })

  useFrame(() => {
    if (goalLight.current && goalTarget.current) {
      goalLight.current.target = goalTarget.current
      goalLight.current.target.updateMatrixWorld()
    }
  })

  return (
    <group position={position}>
      <Text scale={1} font="./bebas-neue-v9-latin-regular.woff" position={[0, 2.25, 2]}>
        Finish
        <meshBasicMaterial color="#ffff99" toneMapped={false} />
      </Text>

      <spotLight
        ref={goalLight}
        position={[0, 5, 1]}
        intensity={55}
        angle={0.7}
        penumbra={0.4}
        distance={20}
        decay={1.2}
        color="#d8ffff"
      />
      <object3D ref={goalTarget} position={[0, 0, -0.75]} />

      <mesh
        geometry={lineGeometry}
        material={lineMaterial}
        scale={[4, 0.05, 0.2]}
        position={[0, 0.05, -0.75]}
      />

      <mesh
        geometry={boxGeometry}
        material={grassLight}
        scale={[4, 0.2, 4]}
        position={[0, 0, 0]}
        receiveShadow
      />

      <RigidBody type="fixed" colliders={false} position={[0, 0, -0.75]} restitution={0.2} friction={0}>
        <primitive object={footballGoal.scene} scale={0.5} />
      </RigidBody>
    </group>
  )
}

const Bounds = ({ length = 1 }) => {
  const boardCount = Math.max(3, Math.ceil(length))
  const startZ = 0
  const endZ = -(length * 4) + 4
  const standLength = length * 4
  const standZ = -(length * 2) + 2
  const tiers = 5

  const StadiumStand = ({ side }) => {
    const xDir = side
    const rows = Array.from({ length: tiers }, (_, i) => ({
      x: xDir * (1.95 + i * 0.22),
      y: 0.28 + i * 0.2,
      depth: 0.38 - i * 0.03,
    }))

    return (
      <group>
        {rows.map((row, i) => (
          <mesh
            key={`tier-${side}-${i}`}
            geometry={boxGeometry}
            material={seatMaterial}
            scale={[row.depth, 0.18, standLength]}
            position={[row.x, row.y, standZ]}
            castShadow={false}
            receiveShadow
          />
        ))}

        <mesh
          geometry={boxGeometry}
          material={standBackMaterial}
          scale={[0.55, 1.45, standLength]}
          position={[xDir * (2.15 + tiers * 0.22), 0.72, standZ]}
          receiveShadow
        />

        <mesh
          geometry={boxGeometry}
          material={fasciaMaterial}
          scale={[0.12, 0.35, standLength]}
          position={[xDir * 1.82, 0.18, standZ]}
        />

        <mesh
          geometry={boxGeometry}
          material={railingMaterial}
          scale={[0.05, 0.06, standLength]}
          position={[xDir * 1.78, 1.22, standZ]}
          castShadow={false}
        />
      </group>
    )
  }

  return (
    <RigidBody type="fixed" restitution={0.2} friction={0}>
      <StadiumStand side={1} />
      <StadiumStand side={-1} />

      {Array.from({ length: boardCount }).map((_, i) => {
        const t = boardCount === 1 ? 0.5 : i / (boardCount - 1)
        const z = startZ + (endZ - startZ) * t
        return (
          <group key={`ads-${i}`}>
            <mesh
              geometry={planeGeometry}
              material={adBoardMaterial}
              scale={[3.0, 0.32, 1]}
              position={[1.72, 0.42, z]}
              rotation={[0, -Math.PI / 2, 0]}
            />
            <mesh
              geometry={planeGeometry}
              material={adBoardMaterial}
              scale={[3.0, 0.32, 1]}
              position={[-1.72, 0.42, z]}
              rotation={[0, Math.PI / 2, 0]}
            />
          </group>
        )
      })}

      <mesh
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[4, 1.5, 0.3]}
        position={[0, 0.75, -(length * 4) + 2]}
        receiveShadow
      />

      <CuboidCollider
        args={[2, 0.1, length * 2]}
        position={[0, -0.1, -(length * 2) + 2]}
        restitution={0.2}
        friction={1}
      />

      <CuboidCollider args={[0.15, 1.5, length * 2]} position={[2.15, 0.75, -(length * 2) + 2]} />
      <CuboidCollider args={[0.15, 1.5, length * 2]} position={[-2.15, 0.75, -(length * 2) + 2]} />
    </RigidBody>
  )
}

export const Level = ({ count = 5, types = [BlockAxe, BlockLimbo, BlockSpinner], seed }) => {
  const blocks = useMemo(() => {
    const next = []
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      next.push(type)
    }
    return next
  }, [count, types, seed])

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  )
}
