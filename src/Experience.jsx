import { Debug, Physics } from '@react-three/rapier'
import { Level, BlockAxe, BlockLimbo, BlockSpinner } from './Level.jsx'
import Lights from './Lights.jsx'
import Player from './Player.jsx'
import useGames from './stores/useGames.js'

export default function Experience()
{
    const blockCounts = useGames((state) => state.blockCount)
    const blocksSeed = useGames((state) => state.blocksSeed)
    return <>

        <Physics>
            <Debug />
            <Lights />
            <Level count={blockCounts} seed={blocksSeed} />
            <Player />
        </Physics>

    </>
}