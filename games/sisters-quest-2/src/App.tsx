import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGame } from './game/store'
import { CameraRig } from './scene/CameraRig'
import { QueensChamber } from './scene/QueensChamber'
import { Sisters } from './scene/Sisters'
import { DialogueOverlay } from './ui/DialogueOverlay'
import { Casebook, SisterSwitch, StatusLine, TopRight, VerbBar } from './ui/Hud'
import { Menu } from './ui/Menu'

export default function App() {
  const started = useGame((s) => s.started)
  const hover = useGame((s) => s.hoverHotspot)

  // Tab swaps sisters anywhere in the game
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        const s = useGame.getState()
        if (s.started && !s.dialogue) s.swapSister()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'default'
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [hover])

  return (
    <div className="game-root">
      <Canvas
        shadows
        camera={{ fov: 40, position: [0, 4.5, 8.8], near: 0.1, far: 60 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#06070f']} />
        <fog attach="fog" args={['#06070f', 12, 26]} />
        <hemisphereLight args={['#6a7ab8', '#2a2438', 0.9]} />
        <ambientLight color="#54639a" intensity={0.7} />
        <directionalLight
          position={[3.5, 6.5, -2]}
          color="#b8ccff"
          intensity={1.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* moonlight bounce where the crooked beam lands */}
        <pointLight
          position={[-0.2, 1.3, -0.9]}
          color="#7f9aff"
          intensity={2.5}
          distance={5.5}
          decay={1.8}
        />
        <CameraRig />
        <QueensChamber />
        <Sisters />
      </Canvas>

      {started ? (
        <>
          <StatusLine />
          <SisterSwitch />
          <TopRight />
          <VerbBar />
          <Casebook />
          <DialogueOverlay />
        </>
      ) : (
        <Menu />
      )}
    </div>
  )
}
