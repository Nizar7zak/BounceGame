import { Physics } from '@react-three/rapier'
import { Stars, Environment } from '@react-three/drei'
import Effects from './Effects.jsx'
import Confetti from './Confetti.jsx'
import { Level } from './Level.jsx'
import Lights from './Lights.jsx'
import Player from './Player.jsx'
import useGames from './stores/useGames.js'

export default function Experience() {
  const blockCounts = useGames((state) => state.blockCount)
  const blocksSeed = useGames((state) => state.blocksSeed)
  const runId = useGames((state) => state.runId)
  const phase = useGames((state) => state.phase)

  return (
    <>
      <color args={['#101826']} attach="background" />
      <fog attach="fog" args={['#101826', 28, 90]} />

      <Environment files="./textures/hdri/moonless_golf_1k.hdr" environmentIntensity={0.35} />

      <Stars radius={80} depth={40} count={1200} factor={3.5} saturation={0} fade speed={0.4} />

      <Physics key={runId}>
        <Lights />
        <Level count={blockCounts} seed={blocksSeed} />
        <Player />
      </Physics>

      {phase === 'ended' ? (
        <Confetti position={[0, 1.2, -(blockCounts + 1) * 4 - 0.75]} />
      ) : null}

      <Effects />
    </>
  )
}
