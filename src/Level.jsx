import * as THREE from 'three'
import BlockSpinner from './BlockSpinner'

THREE.ColorManagement.legacyMode = false

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
 
const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })

import BlockStart from "./BlockStart"

const Level = () => {
  return (
    <>
        <BlockStart position={[ 0, 0, 4 ]} material={floor1Material} geometry={boxGeometry} />
        <BlockSpinner position={[ 0, 0, 0 ]} material={floor2Material} geometry={boxGeometry} />
    </>
  )
}

export default Level