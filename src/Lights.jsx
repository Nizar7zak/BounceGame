import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { poleMaterial, lampMaterial } from './materials.js'

const poleGeometry = new THREE.CylinderGeometry(0.1, 0.12, 6, 8)
const lampGeometry = new THREE.BoxGeometry(0.8, 0.25, 0.5)

function Floodlight({ position, target }) {
  const light = useRef()
  const targetRef = useRef()

  useFrame(() => {
    if (light.current && targetRef.current) {
      light.current.target = targetRef.current
      light.current.target.updateMatrixWorld()
    }
  })

  return (
    <group position={position}>
      <mesh geometry={poleGeometry} material={poleMaterial} position={[0, 3, 0]} />
      <mesh geometry={lampGeometry} material={lampMaterial} position={[0, 6.15, 0]} />
      <spotLight
        ref={light}
        position={[0, 6, 0]}
        intensity={40}
        angle={0.55}
        penumbra={0.45}
        distance={55}
        decay={1.5}
        color="#fff4c2"
        castShadow={false}
      />
      <object3D ref={targetRef} position={target} />
    </group>
  )
}

export default function Lights() {
  const dirLight = useRef()

  useFrame((state) => {
    if (!dirLight.current) return
    dirLight.current.position.z = state.camera.position.z + 1 - 4
    dirLight.current.target.position.z = state.camera.position.z - 4
    dirLight.current.target.updateMatrixWorld()
  })

  return (
    <>
      <ambientLight intensity={0.55} color="#6f8fb8" />
      <hemisphereLight intensity={0.85} color="#7aa0d8" groundColor="#1f4a1a" />

      <directionalLight
        ref={dirLight}
        castShadow
        position={[4, 5, 1]}
        intensity={2.4}
        color="#d7e6ff"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={12}
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
      />

      <Floodlight position={[3.2, 0, -8]} target={[0, 0, -12]} />
      <Floodlight position={[-3.2, 0, -8]} target={[0, 0, -12]} />
      <Floodlight position={[3.2, 0, -28]} target={[0, 0, -32]} />
      <Floodlight position={[-3.2, 0, -28]} target={[0, 0, -32]} />
      <Floodlight position={[3.2, 0, -48]} target={[0, 0, -52]} />
      <Floodlight position={[-3.2, 0, -48]} target={[0, 0, -52]} />
    </>
  )
}
