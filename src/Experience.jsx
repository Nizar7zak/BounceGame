import { OrbitControls } from '@react-three/drei'
import Level from './Level.jsx'
import Lights from './Lights.jsx'

export default function Experience()
{
    return <>

        <OrbitControls makeDefault />

        <Lights />

        <Level />

    </>
}