import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

THREE.ColorManagement.legacyMode = false

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
 
const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })


const BlockSpinner = ({ position=[ 0, 0, 0 ] }) => {
    return (
      <group position={position}>
  
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            scale={[ 4, 0.2, 4 ]} 
            position={[ 0, -0.1, 0 ]}
            receiveShadow
        />

        <RigidBody type="kinematicPosition" position={[ 0, 0.3, 0]} restitution={0.2} friction={0} >

            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[ 3.5, 0.3, 0.3 ]} 
                castShadow
                receiveShadow
            />

        </RigidBody>
  
      </group>
    )
}


const BlockStart = ({ position=[ 0, 0, 0 ] }) => {
    return (
      <group position={position}>
  
        <mesh
            geometry={boxGeometry}
            material={floor1Material}
            scale={[ 4, 0.2, 4 ]} 
            position={[ 0, -0.1, 0 ]}
            receiveShadow
        />
  
      </group>
    )
}

  
const Level = () => {
  return (
    <>
        <BlockStart position={[ 0, 0, 4 ]} />
        <BlockSpinner position={[ 0, 0, 0 ]} />
    </>
  )
}

export default Level