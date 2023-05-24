import { OrbitControls } from '@react-three/drei'
import { Debug, Physics } from '@react-three/rapier'
import Level from './Level.jsx'
import Lights from './Lights.jsx'

export default function Experience()
{
    return <>

        <OrbitControls makeDefault />

        <Physics>
            <Debug />
            <Lights />
            <Level />
        </Physics>

    </>
}