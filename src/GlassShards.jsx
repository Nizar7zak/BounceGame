import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const COUNT = 18
const COLORS = ['#e8f8ff', '#c8ecff', '#ffffff', '#b8e4ff', '#d0f0ff']

export default function GlassShards({ origin = [0, 0, 0], scale = [1, 1, 1], onDone }) {
  const meshRef = useRef()
  const active = useRef(true)
  const life = useRef(0)

  const particles = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        rx: 0,
        ry: 0,
        rz: 0,
        spinX: 0,
        spinY: 0,
        spinZ: 0,
      })),
    []
  )

  const dummy = useMemo(() => new THREE.Object3D(), [])

  const colorArray = useMemo(() => {
    const colors = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const col = new THREE.Color(COLORS[i % COLORS.length])
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }
    return colors
  }, [])

  useLayoutEffect(() => {
    if (!meshRef.current) return

    const mesh = meshRef.current
    mesh.instanceColor = new THREE.InstancedBufferAttribute(colorArray, 3)

    particles.forEach((p, i) => {
      p.x = origin[0] + (Math.random() - 0.5) * scale[0] * 0.8
      p.y = origin[1] + (Math.random() - 0.5) * scale[1] * 0.8
      p.z = origin[2] + (Math.random() - 0.5) * scale[2] * 0.8
      p.vx = (Math.random() - 0.5) * 3.5
      p.vy = Math.random() * 2 + 1
      p.vz = (Math.random() - 0.5) * 3.5
      p.spinX = (Math.random() - 0.5) * 12
      p.spinY = (Math.random() - 0.5) * 12
      p.spinZ = (Math.random() - 0.5) * 12
      p.rx = Math.random() * Math.PI
      p.ry = Math.random() * Math.PI
      p.rz = Math.random() * Math.PI

      dummy.position.set(p.x, p.y, p.z)
      dummy.rotation.set(p.rx, p.ry, p.rz)
      dummy.scale.set(
        0.04 + Math.random() * 0.06,
        0.02 + Math.random() * 0.04,
        0.01 + Math.random() * 0.02
      )
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
  }, [colorArray, dummy, origin, particles, scale])

  useFrame((_, delta) => {
    if (!active.current || !meshRef.current) return

    life.current += delta
    const mesh = meshRef.current

    particles.forEach((p, i) => {
      p.vy -= 9.8 * delta
      p.x += p.vx * delta
      p.y += p.vy * delta
      p.z += p.vz * delta
      p.rx += p.spinX * delta
      p.ry += p.spinY * delta
      p.rz += p.spinZ * delta

      const fade = Math.max(0, 1 - life.current * 1.8)
      dummy.position.set(p.x, p.y, p.z)
      dummy.rotation.set(p.rx, p.ry, p.rz)
      dummy.scale.set(
        (0.04 + (i % 3) * 0.02) * fade,
        (0.03 + (i % 2) * 0.015) * fade,
        0.015 * fade
      )
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true

    if (life.current > 1.2) {
      active.current = false
      onDone?.()
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        vertexColors
        transparent
        opacity={0.85}
        toneMapped={false}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </instancedMesh>
  )
}
