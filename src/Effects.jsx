import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'

const Effects = () => {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.85}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.35}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.25} darkness={0.45} />
    </EffectComposer>
  )
}

export default Effects
