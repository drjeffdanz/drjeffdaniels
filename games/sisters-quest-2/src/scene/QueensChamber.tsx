import { useMemo } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { HOTSPOT_MAP } from '../game/data/hotspots'
import { useGame } from '../game/store'
import { Hotspot } from './Hotspot'
import { walkTo } from './Sisters'

const WALL = '#3a4170'
const FLOOR = '#2b3156'
const WOOD = '#4a3521'

// The crooked moonbeam: enters the window true, kinks mid-air at the Bend,
// lands where no honest moonbeam would.
const BEAM_START = new THREE.Vector3(2.6, 2.5, -4.55)
const BEAM_BEND = new THREE.Vector3(1.6, 1.3, -2.4)
const BEAM_END = new THREE.Vector3(-0.2, 0.02, -0.9)
// Where the beam *should* land if it traveled straight
const HONEST_END = new THREE.Vector3(2.6 - (2.6 - 1.6) * 2.03, 0.02, -4.55 - (-4.55 + 2.4) * 2.03)

function BeamSegment({ from, to, radius }: { from: THREE.Vector3; to: THREE.Vector3; radius: number }) {
  const { position, quaternion, length } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(to, from)
    const length = dir.length()
    const position = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    )
    return { position, quaternion, length }
  }, [from, to])
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius * 1.35, length, 12, 1, true]} />
      <meshBasicMaterial
        color="#a8bfff"
        transparent
        opacity={0.22}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export function QueensChamber() {
  const onFloorClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const s = useGame.getState()
    if (!s.started) return
    if (s.dialogue) {
      s.advanceDialogue()
      return
    }
    walkTo(e.point.x, e.point.z)
  }

  return (
    <group>
      {/* ── Shell ─────────────────────────────────────────── */}
      <mesh position={[0, -0.05, 0]} receiveShadow onClick={onFloorClick}>
        <boxGeometry args={[10.6, 0.1, 9.8]} />
        <meshStandardMaterial color={FLOOR} roughness={0.9} />
      </mesh>
      {/* rug */}
      <mesh position={[0.2, 0.005, 1.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.6, 40]} />
        <meshStandardMaterial color="#3a2f52" roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.1, -4.85]} receiveShadow>
        <boxGeometry args={[10.6, 4.4, 0.2]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>
      <mesh position={[-5.35, 2.1, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4.4, 9.8]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>
      <mesh position={[5.35, 2.1, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4.4, 9.8]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>

      {/* ── The Queen's bed (hotspot: queen) ─────────────── */}
      <group position={[-3.2, 0, -3.2]}>
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.6, 2.9]} />
          <meshStandardMaterial color={WOOD} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[2.3, 0.25, 2.7]} />
          <meshStandardMaterial color="#b9bedd" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.5, -1.35]} castShadow>
          <boxGeometry args={[2.5, 1.6, 0.18]} />
          <meshStandardMaterial color={WOOD} roughness={0.85} />
        </mesh>
        {/* blanket */}
        <mesh position={[0, 0.92, 0.25]} castShadow>
          <boxGeometry args={[2.0, 0.22, 2.0]} />
          <meshStandardMaterial color="#5d4f8e" roughness={0.9} />
        </mesh>
        {/* pillow + the sleeping Queen */}
        <mesh position={[0, 0.92, -1.0]}>
          <boxGeometry args={[1.2, 0.2, 0.55]} />
          <meshStandardMaterial color="#d8dcf2" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.06, -0.95]}>
          <sphereGeometry args={[0.19, 20, 16]} />
          <meshStandardMaterial color="#e2bd9c" roughness={0.7} />
        </mesh>
      </group>

      {/* ── Tapestry of Elderwyn (hotspot: tapestry) ─────── */}
      <group position={[-0.7, 2.3, -4.72]}>
        <mesh>
          <planeGeometry args={[2.6, 1.9]} />
          <meshStandardMaterial color="#8a6f35" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2.4, 1.7]} />
          <meshStandardMaterial color="#7a2f4a" roughness={0.9} />
        </mesh>
        {/* embroidered moon over Cresthollow */}
        <mesh position={[0.55, 0.45, 0.02]}>
          <circleGeometry args={[0.14, 24]} />
          <meshStandardMaterial color="#e8e2c8" emissive="#4a4530" roughness={0.7} />
        </mesh>
        {/* the loose thread, hanging down-and-left */}
        <mesh position={[0.38, 0.18, 0.03]} rotation={[0, 0, 0.5]}>
          <planeGeometry args={[0.02, 0.5]} />
          <meshBasicMaterial color="#e8e2c8" />
        </mesh>
      </group>

      {/* ── Tall window + moon (hotspot: window) ─────────── */}
      <group position={[2.6, 2.5, -4.72]}>
        <mesh>
          <planeGeometry args={[1.7, 2.5]} />
          <meshStandardMaterial color="#0c1128" roughness={0.4} />
        </mesh>
        {/* night sky + full moon */}
        <mesh position={[0.25, 0.55, 0.01]}>
          <circleGeometry args={[0.32, 32]} />
          <meshBasicMaterial color="#dfe9ff" />
        </mesh>
        {/* frame */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.8, 0.08]} />
          <meshStandardMaterial color={WOOD} />
        </mesh>
        <mesh position={[0, 0, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[2.6, 0.08]} />
          <meshStandardMaterial color={WOOD} />
        </mesh>
      </group>

      {/* ── The crooked moonbeam (hotspot: moonbeam) ─────── */}
      <BeamSegment from={BEAM_START} to={BEAM_BEND} radius={0.16} />
      <BeamSegment from={BEAM_BEND} to={BEAM_END} radius={0.2} />
      {/* where it lands (wrong) */}
      <mesh position={BEAM_END} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial
          color="#c3d4ff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* ghost ring where it should land */}
      <mesh position={HONEST_END} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.5, 32]} />
        <meshBasicMaterial color="#5d719f" transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* ── Door to the courtyard (hotspot: door) ────────── */}
      <group position={[5.24, 0, 2.0]}>
        <mesh position={[0, 1.35, 0]} castShadow>
          <boxGeometry args={[0.15, 2.7, 1.5]} />
          <meshStandardMaterial color={WOOD} roughness={0.85} />
        </mesh>
        <mesh position={[-0.1, 1.3, 0.5]}>
          <sphereGeometry args={[0.07, 12, 10]} />
          <meshStandardMaterial color="#b08d3f" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* ── Desk & candle ────────────────────────────────── */}
      <group position={[4.3, 0, -2.6]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.3, 0.09, 1.1]} />
          <meshStandardMaterial color={WOOD} roughness={0.85} />
        </mesh>
        <mesh position={[-0.5, 0.22, -0.4]}>
          <boxGeometry args={[0.09, 0.45, 0.09]} />
          <meshStandardMaterial color={WOOD} />
        </mesh>
        <mesh position={[0.5, 0.22, -0.4]}>
          <boxGeometry args={[0.09, 0.45, 0.09]} />
          <meshStandardMaterial color={WOOD} />
        </mesh>
        <mesh position={[-0.5, 0.22, 0.4]}>
          <boxGeometry args={[0.09, 0.45, 0.09]} />
          <meshStandardMaterial color={WOOD} />
        </mesh>
        <mesh position={[0.5, 0.22, 0.4]}>
          <boxGeometry args={[0.09, 0.45, 0.09]} />
          <meshStandardMaterial color={WOOD} />
        </mesh>
        {/* candle */}
        <mesh position={[0.2, 0.62, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.25, 10]} />
          <meshStandardMaterial color="#e8dcc0" />
        </mesh>
        <mesh position={[0.2, 0.8, 0]}>
          <coneGeometry args={[0.035, 0.11, 8]} />
          <meshBasicMaterial color="#ffb85c" />
        </mesh>
        <pointLight
          position={[0.2, 1.0, 0]}
          color="#ff9a4d"
          intensity={3}
          distance={7}
          decay={1.8}
        />
      </group>

      {/* ── Hotspot colliders ────────────────────────────── */}
      <Hotspot def={HOTSPOT_MAP.queen} position={[-3.2, 1.0, -3.2]} size={[2.6, 1.6, 3.0]} />
      <Hotspot def={HOTSPOT_MAP.moonbeam} position={[0.7, 0.9, -1.7]} size={[2.4, 2.0, 2.2]} />
      <Hotspot def={HOTSPOT_MAP.tapestry} position={[-0.7, 2.3, -4.6]} size={[2.6, 1.9, 0.35]} />
      <Hotspot def={HOTSPOT_MAP.window} position={[2.6, 2.5, -4.6]} size={[1.8, 2.5, 0.35]} />
      <Hotspot def={HOTSPOT_MAP.door} position={[5.15, 1.35, 2.0]} size={[0.5, 2.7, 1.6]} />
    </group>
  )
}
