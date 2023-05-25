import { OrbitControls } from '@react-three/drei'
import { Debug, Physics } from '@react-three/rapier'
import { Level, BlockAxe, BlockLimbo, BlockSpinner } from './Level.jsx'
import Lights from './Lights.jsx'
import Player from './Player.jsx'

export default function Experience()
{
    return <>

        <OrbitControls makeDefault />

        <Physics>
            <Debug />
            <Lights />
            <Level />
            <Player />
        </Physics>

    </>
}