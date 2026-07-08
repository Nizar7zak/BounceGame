import * as THREE from 'three'

const loader = new THREE.TextureLoader()

function loadMap(path, { srgb = false, repeat = [1, 1] } = {}) {
  const map = loader.load(path)
  map.wrapS = THREE.RepeatWrapping
  map.wrapT = THREE.RepeatWrapping
  map.repeat.set(repeat[0], repeat[1])
  map.anisotropy = 8
  if (srgb) map.colorSpace = THREE.SRGBColorSpace
  return map
}

function cloneMaps(maps) {
  return {
    map: maps.map.clone(),
    normalMap: maps.normalMap.clone(),
    roughnessMap: maps.roughnessMap?.clone(),
    aoMap: maps.aoMap?.clone(),
  }
}

const grassMaps = {
  map: loadMap('./textures/grass/diff_1k.jpg', { srgb: true, repeat: [2, 2] }),
  normalMap: loadMap('./textures/grass/nor_gl_1k.jpg', { repeat: [2, 2] }),
  roughnessMap: loadMap('./textures/grass/rough_1k.jpg', { repeat: [2, 2] }),
}

const grassDarkMaps = cloneMaps(grassMaps)
Object.values(grassDarkMaps).forEach((map) => {
  if (!map) return
  map.wrapS = THREE.RepeatWrapping
  map.wrapT = THREE.RepeatWrapping
  map.repeat.set(2, 2)
  map.anisotropy = 8
})
if (grassDarkMaps.map) grassDarkMaps.map.colorSpace = THREE.SRGBColorSpace

const concreteMaps = {
  map: loadMap('./textures/concrete/diff_1k.jpg', { srgb: true, repeat: [1, 4] }),
  normalMap: loadMap('./textures/concrete/nor_gl_1k.jpg', { repeat: [1, 4] }),
  roughnessMap: loadMap('./textures/concrete/rough_1k.jpg', { repeat: [1, 4] }),
}

export const grassLight = new THREE.MeshStandardMaterial({
  map: grassMaps.map,
  normalMap: grassMaps.normalMap,
  roughnessMap: grassMaps.roughnessMap,
  color: '#c8e8a8',
  metalness: 0,
  roughness: 0.95,
  envMapIntensity: 0.25,
})

export const grassDark = new THREE.MeshStandardMaterial({
  map: grassDarkMaps.map,
  normalMap: grassDarkMaps.normalMap,
  roughnessMap: grassDarkMaps.roughnessMap,
  color: '#9ec87a',
  metalness: 0,
  roughness: 0.95,
  envMapIntensity: 0.25,
})

export const wallMaterial = new THREE.MeshStandardMaterial({
  ...concreteMaps,
  color: '#6a7388',
  metalness: 0.15,
  roughness: 0.85,
  envMapIntensity: 0.35,
})

function createSeatTextures() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#142030'
  ctx.fillRect(0, 0, 256, 256)

  const rows = 8
  const cols = 12
  const seatW = 18
  const seatH = 10
  const gapX = 4
  const gapY = 6

  const emissiveCanvas = document.createElement('canvas')
  emissiveCanvas.width = 256
  emissiveCanvas.height = 256
  const ectx = emissiveCanvas.getContext('2d')
  ectx.fillStyle = '#000000'
  ectx.fillRect(0, 0, 256, 256)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = 8 + col * (seatW + gapX)
      const y = 10 + row * (seatH + gapY)
      const shade = row % 2 === 0 ? '#2a4f6e' : '#234560'
      ctx.fillStyle = shade
      ctx.fillRect(x, y, seatW, seatH)

      if (Math.random() < 0.08) {
        ectx.fillStyle = `hsl(${35 + Math.random() * 25}, 90%, ${55 + Math.random() * 20}%)`
        ectx.fillRect(x + 2, y + 2, seatW - 4, seatH - 4)
      }
    }
  }

  const map = new THREE.CanvasTexture(canvas)
  map.wrapS = THREE.RepeatWrapping
  map.wrapT = THREE.RepeatWrapping
  map.repeat.set(1, 6)
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = 8

  const emissiveMap = new THREE.CanvasTexture(emissiveCanvas)
  emissiveMap.wrapS = THREE.RepeatWrapping
  emissiveMap.wrapT = THREE.RepeatWrapping
  emissiveMap.repeat.set(1, 6)
  emissiveMap.colorSpace = THREE.SRGBColorSpace
  emissiveMap.anisotropy = 8

  return { map, emissiveMap }
}

const seatTextures = createSeatTextures()

export const seatMaterial = new THREE.MeshStandardMaterial({
  map: seatTextures.map,
  emissiveMap: seatTextures.emissiveMap,
  emissive: '#ffffff',
  emissiveIntensity: 0.9,
  color: '#8ab0cc',
  metalness: 0.1,
  roughness: 0.75,
  envMapIntensity: 0.3,
})

export const standBackMaterial = new THREE.MeshStandardMaterial({
  color: '#0c1218',
  metalness: 0.2,
  roughness: 0.9,
  envMapIntensity: 0.15,
})

export const railingMaterial = new THREE.MeshStandardMaterial({
  color: '#c8d0d8',
  metalness: 0.9,
  roughness: 0.2,
  envMapIntensity: 1.2,
})

export const fasciaMaterial = new THREE.MeshStandardMaterial({
  color: '#101820',
  metalness: 0.3,
  roughness: 0.6,
  envMapIntensity: 0.25,
})

export const obstacleMaterial = new THREE.MeshStandardMaterial({
  color: '#ff3b3b',
  metalness: 0.35,
  roughness: 0.35,
  roughnessMap: concreteMaps.roughnessMap,
  emissive: '#ff1a1a',
  emissiveIntensity: 1.15,
  envMapIntensity: 0.9,
})

function createStripeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const stripe = 16
  for (let x = 0; x < canvas.width; x += stripe) {
    ctx.fillStyle = (x / stripe) % 2 === 0 ? '#ffd400' : '#333333'
    ctx.fillRect(x, 0, stripe, canvas.height)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(8, 1)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

const hurdleStripe = createStripeTexture()

export const postMaterial = new THREE.MeshStandardMaterial({
  color: '#e8e8e8',
  metalness: 0.4,
  roughness: 0.45,
  envMapIntensity: 0.6,
})

export const hurdleBarMaterial = new THREE.MeshBasicMaterial({
  map: hurdleStripe,
  toneMapped: false,
})

export const coneMaterial = new THREE.MeshBasicMaterial({
  color: '#ff7722',
  toneMapped: false,
})

export const dummyMaterial = new THREE.MeshBasicMaterial({
  color: '#ff5533',
  toneMapped: false,
})

export const lineMaterial = new THREE.MeshStandardMaterial({
  color: '#f2f2f2',
  metalness: 0.05,
  roughness: 0.55,
  envMapIntensity: 0.2,
})

function createAdBoardTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, 1024, 0)
  gradient.addColorStop(0, '#1a2840')
  gradient.addColorStop(0.5, '#243552')
  gradient.addColorStop(1, '#1a2840')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1024, 128)

  ctx.strokeStyle = '#3de0ff'
  ctx.lineWidth = 4
  ctx.strokeRect(8, 8, 1008, 112)

  ctx.fillStyle = '#7ef9ff'
  ctx.shadowColor = '#2ad4ff'
  ctx.shadowBlur = 18
  ctx.font = 'bold 54px Bebas Neue, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('BOUNCE  •  R3F  •  GOAL!', 512, 68)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

const adMap = createAdBoardTexture()

export const adBoardMaterial = new THREE.MeshBasicMaterial({
  map: adMap,
  toneMapped: false,
  side: THREE.DoubleSide,
})

export const poleMaterial = new THREE.MeshStandardMaterial({
  color: '#2a2f38',
  metalness: 0.85,
  roughness: 0.28,
  envMapIntensity: 1.1,
})

export const lampMaterial = new THREE.MeshStandardMaterial({
  color: '#fff6c8',
  emissive: '#ffe566',
  emissiveIntensity: 2.4,
  metalness: 0.2,
  roughness: 0.35,
  toneMapped: false,
  envMapIntensity: 0.4,
})

export const beamMaterial = new THREE.MeshBasicMaterial({
  color: '#fff2a8',
  transparent: true,
  opacity: 0.08,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  toneMapped: false,
})
