import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function createGlassMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: '#d4f4ff',
    metalness: 0.05,
    roughness: 0.04,
    transmission: 0.88,
    thickness: 0.35,
    transparent: true,
    opacity: 0.55,
    envMapIntensity: 1.8,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    ior: 1.45,
    emissive: '#8fdfff',
    emissiveIntensity: 0.12,
    side: THREE.DoubleSide,
    toneMapped: false,
  })
}

function createEdgeMaterial() {
  return new THREE.MeshBasicMaterial({
    color: '#e8fcff',
    transparent: true,
    opacity: 0.35,
    toneMapped: false,
    wireframe: true,
  })
}

export default function GlassPanel({ scale, breaking = false }) {
  const group = useRef()
  const breakProgress = useRef(0)
  const materials = useMemo(
    () => ({
      glass: createGlassMaterial(),
      edge: createEdgeMaterial(),
    }),
    []
  )

  useFrame((_, delta) => {
    if (!breaking || !group.current) return

    breakProgress.current = Math.min(1, breakProgress.current + delta * 6)
    const t = breakProgress.current
    group.current.scale.set(
      scale[0] * (1 + t * 0.15),
      scale[1] * (1 - t * 0.85),
      scale[2] * (1 + t * 0.15)
    )

    materials.glass.opacity = Math.max(0, 0.55 - t * 0.7)
    materials.edge.opacity = Math.max(0, 0.35 - t * 0.5)
  })

  return (
    <group ref={group} scale={scale}>
      <mesh material={materials.glass} castShadow={false} receiveShadow>
        <boxGeometry />
      </mesh>
      <mesh material={materials.edge} scale={[1.005, 1.005, 1.005]}>
        <boxGeometry />
      </mesh>
    </group>
  )
}
