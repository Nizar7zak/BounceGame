import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const COUNT = 150
const COLORS = ['#ff4444', '#44ff88', '#4488ff', '#ffdd44', '#ff44ff', '#ffffff']

export default function Confetti({ position = [0, 1, 0] }) {
  const meshRef = useRef()
  const active = useRef(false)
  const burstOnMount = useRef(true)

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
        alive: false,
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

    for (let i = 0; i < COUNT; i++) {
      dummy.position.set(position[0], position[1] - 100, position[2])
      dummy.scale.set(0, 0, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }

    mesh.instanceMatrix.needsUpdate = true

    if (burstOnMount.current) {
      particles.forEach((p) => {
        p.alive = true
        p.x = position[0] + (Math.random() - 0.5) * 2
        p.y = position[1] + Math.random() * 0.5
        p.z = position[2] + (Math.random() - 0.5) * 0.5
        p.vx = (Math.random() - 0.5) * 4
        p.vy = Math.random() * 6 + 2
        p.vz = (Math.random() - 0.5) * 4
        p.spinX = (Math.random() - 0.5) * 10
        p.spinY = (Math.random() - 0.5) * 10
        p.spinZ = (Math.random() - 0.5) * 10
        p.rx = Math.random() * Math.PI
        p.ry = Math.random() * Math.PI
        p.rz = Math.random() * Math.PI
      })
      active.current = true
      burstOnMount.current = false
    }
  }, [colorArray, dummy, particles, position])

  useFrame((_, delta) => {
    if (!active.current || !meshRef.current) return

    const mesh = meshRef.current
    let anyAlive = false

    particles.forEach((p, i) => {
      if (!p.alive) {
        dummy.position.set(position[0], position[1] - 10, position[2])
        dummy.scale.set(0, 0, 0)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
        return
      }

      anyAlive = true
      p.vy -= 9.8 * delta
      p.x += p.vx * delta
      p.y += p.vy * delta
      p.z += p.vz * delta
      p.rx += p.spinX * delta
      p.ry += p.spinY * delta
      p.rz += p.spinZ * delta

      if (p.y < -2) p.alive = false

      dummy.position.set(p.x, p.y, p.z)
      dummy.rotation.set(p.rx, p.ry, p.rz)
      dummy.scale.set(0.08, 0.12, 0.02)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
    if (!anyAlive) active.current = false
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial vertexColors toneMapped={false} side={THREE.DoubleSide} />
    </instancedMesh>
  )
}
