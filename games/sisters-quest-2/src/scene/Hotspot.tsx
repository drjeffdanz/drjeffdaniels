import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { runInteraction } from '../game/interactions'
import { useGame } from '../game/store'
import type { HotspotDef } from '../game/types'
import { activeSisterDistanceTo, walkTo } from './Sisters'

const INTERACT_RANGE = 1.7

interface Props {
  def: HotspotDef
  // Invisible collider box for pointer events
  position: [number, number, number]
  size: [number, number, number]
}

export function Hotspot({ def, position, size }: Props) {
  const ring = useRef<THREE.Mesh>(null)
  const hovered = useGame((s) => s.hoverHotspot === def.name)

  useFrame(({ clock }) => {
    if (!ring.current) return
    ring.current.visible = hovered
    if (hovered) {
      const m = ring.current.material as THREE.MeshBasicMaterial
      m.opacity = 0.35 + Math.sin(clock.elapsedTime * 5) * 0.15
    }
  })

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const state = useGame.getState()
    if (!state.started) return
    if (state.dialogue) {
      state.advanceDialogue()
      return
    }
    const verb = state.verb
    const [ix, iz] = def.interactPoint
    if (activeSisterDistanceTo(ix, iz) <= INTERACT_RANGE) {
      runInteraction(def.id, verb)
    } else {
      walkTo(ix, iz, () => runInteraction(def.id, verb))
    }
  }

  return (
    <group>
      <mesh
        position={position}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          useGame.getState().setHover(def.name)
        }}
        onPointerOut={() => {
          const s = useGame.getState()
          if (s.hoverHotspot === def.name) s.setHover(null)
        }}
      >
        <boxGeometry args={size} />
        <meshBasicMaterial visible={false} />
      </mesh>
      <mesh
        ref={ring}
        visible={false}
        position={[def.interactPoint[0], 0.02, def.interactPoint[1]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.3, 0.38, 32]} />
        <meshBasicMaterial color="#e8d9a0" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}
