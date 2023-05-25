import { Float, Text, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

THREE.ColorManagement.legacyMode = false

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
 
const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })

const BlockStart = ({ position=[ 0, 0, 0 ] }) => {
    return (
      <group position={position}>
        <Float floatIntensity={0.25} rotationIntensity={0.25} >
          <Text 
            scale={0.5}
            font='./bebas-neue-v9-latin-regular.woff'
            maxWidth={0.25}
            lineHeight={0.75}
            textAlign="right"
            position={[ 0.75, 0.65, 0 ]}
            rotation-y = { -0.25 }
          > 
          Marble Race
          <meshBasicMaterial toneMapped={false} />
          </Text>
        </Float>
  
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


export const BlockSpinner = ({ position=[ 0, 0, 0 ] }) => {
    const obstacle = useRef()

    const [ speed ] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1) )
    useFrame((state) => {
        const time = state.clock.elapsedTime

        const euler = new THREE.Euler(0, time * speed , 0)
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(euler)

        obstacle.current.setNextKinematicRotation(rotation)
    })

    return (
      <group position={position}>
  
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            scale={[ 4, 0.2, 4 ]} 
            position={[ 0, -0.1, 0 ]}
            receiveShadow
        />

        <RigidBody ref={obstacle} type="kinematicPosition" position={[ 0, 0.3, 0]} restitution={0.2} friction={0} >

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

export const BlockLimbo = ({ position=[ 0, 0, 0 ] }) => {
    const obstacle = useRef()

    const [ timeOffset ] = useState(() => (Math.random() * Math.PI * 2 ) )
    useFrame((state) => {
        const time = state.clock.elapsedTime

        const y = Math.sin(time + timeOffset) + 1.15
        obstacle.current.setNextKinematicTranslation({x: position[0], y: position[1] + y, z: position[2]})
    })

    return (
      <group position={position}>
  
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            scale={[ 4, 0.2, 4 ]} 
            position={[ 0, -0.1, 0 ]}
            receiveShadow
        />

        <RigidBody ref={obstacle} type="kinematicPosition" position={[ 0, 0.3, 0]} restitution={0.2} friction={0} >

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

export const BlockAxe = ({ position=[ 0, 0, 0 ] }) => {
    const obstacle = useRef()

    const [ timeOffset ] = useState(() => (Math.random() * Math.PI * 2 ) )
    useFrame((state) => {
        const time = state.clock.elapsedTime

        const x = Math.sin(time + timeOffset) * 1.25
        obstacle.current.setNextKinematicTranslation({x: position[0] + x, y: position[1] + 0.75, z: position[2]})
    })

    return (
      <group position={position}>
  
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            scale={[ 4, 0.2, 4 ]} 
            position={[ 0, -0.1, 0 ]}
            receiveShadow
        />

        <RigidBody ref={obstacle} type="kinematicPosition" position={[ 0, 0.3, 0]} restitution={0.2} friction={0} >

            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[ 1.5, 1.5, 0.3 ]} 
                castShadow
                receiveShadow
            />

        </RigidBody>
  
      </group>
    )
}


const BlockEnd = ({ position=[ 0, 0, 0 ] }) => {

    const hamburger = useGLTF('./hamburger.glb')
    hamburger.scene.children.forEach((mesh) => {
        mesh.castShadow = true
    })

    return (
      <group position={position}>

        <Text 
            scale={1}
            font='./bebas-neue-v9-latin-regular.woff'
            // maxWidth={0.25}
            // lineHeight={0.75}
            // textAlign="right"
            position={[ 0, 2.25, 2 ]}
            // rotation-y = { -0.25 }
          > 
          Finish
          <meshBasicMaterial toneMapped={false} />
        </Text>
  
        <mesh
            geometry={boxGeometry}
            material={floor1Material}
            scale={[ 4, 0.2, 4 ]} 
            position={[ 0, 0, 0 ]}
            receiveShadow
        />

        <RigidBody type='fixed' colliders='hull' position={[ 0, 0.25, 0]} restitution={0.2} friction={0} >
            <primitive object={hamburger.scene} scale={ 0.2 } />

        </RigidBody>
  
      </group>
    )
}

const Bounds = ({ length = 1 }) => {
  return (
    <RigidBody type='fixed' restitution={0.2} friction={0} >
      <mesh 
        geometry={boxGeometry}
        material={wallMaterial}
        scale={ [ 0.3, 1.5, length * 4 ] }
        position={ [ 2.15, 0.75, - (length * 2) + 2 ] }
        castShadow
      />

      <mesh 
        geometry={boxGeometry}
        material={wallMaterial}
        scale={ [ 0.3, 1.5, length * 4 ] }
        position={ [ - 2.15, 0.75, - (length * 2) + 2 ] }
        receiveShadow
      /> 

      <mesh 
        geometry={boxGeometry}
        material={wallMaterial}
        scale={ [ 4, 1.5, 0.3 ] }
        position={ [ 0, 0.75, - (length * 4) + 2 ] }
        receiveShadow
      /> 

      <CuboidCollider 
        args={[ 2, 0.1, length * 2 ]}
        position={[ 0, -0.1, -(length * 2) + 2  ]}
        restitution={0.2}
        friction={1}
      />
    </RigidBody>
  )
}

export const Level = ({ count=5, types=[BlockAxe, BlockLimbo, BlockSpinner], seed }) => {

  const blocks = useMemo(() => {
    const blocks = []
    for( let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      blocks.push(type)
    }

    return blocks;

  }, [count, types, seed])
  return (
    <>
      <BlockStart position={[ 0, 0, 0 ]} />
      { blocks.map((Block, index) => <Block key={index} position={[ 0, 0, -(index + 1) * 4  ]} /> ) }
      <BlockEnd position={[ 0, 0, - (count + 1) * 4 ]} />
      <Bounds length={count + 2} />     
    </>
  )
}

