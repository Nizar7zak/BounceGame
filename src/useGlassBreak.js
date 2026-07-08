import { useCallback, useRef, useState } from 'react'
import * as THREE from 'three'
import useGames from './stores/useGames.js'

const punchShake = () => useGames.getState().punchShake()

export default function useGlassBreak(panelScale) {
  const [broken, setBroken] = useState(false)
  const [breaking, setBreaking] = useState(false)
  const [shards, setShards] = useState(false)
  const [shardOrigin, setShardOrigin] = useState([0, 0, 0])

  const colliderRef = useRef()
  const bodyRef = useRef()
  const breakPoint = useRef(new THREE.Vector3())

  const onCollisionEnter = useCallback(() => {
    if (broken || breaking) return

    const translation = bodyRef.current?.translation?.()
    if (translation) {
      breakPoint.current.set(translation.x, translation.y, translation.z)
      setShardOrigin([translation.x, translation.y, translation.z])
    }

    setBreaking(true)
    punchShake()
    useGames.getState().recordGlassBreak()

    window.setTimeout(() => {
      colliderRef.current?.setEnabled(false)
      setBroken(true)
      setShards(true)
      setBreaking(false)
    }, 120)
  }, [broken, breaking])

  const clearShards = useCallback(() => setShards(false), [])

  return {
    broken,
    breaking,
    shards,
    shardOrigin,
    panelScale,
    colliderRef,
    bodyRef,
    onCollisionEnter,
    clearShards,
  }
}
