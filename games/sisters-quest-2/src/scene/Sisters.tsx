import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGame } from '../game/store'
import type { SisterId } from '../game/types'

const SPEED = 2.7
const ARRIVE = 0.08
const FOLLOW_TRIGGER = 1.9
const FOLLOW_STOP = 1.25

// Walkable rectangle of the gray-box chamber, minus furniture footprints.
const BOUNDS = { minX: -4.6, maxX: 4.6, minZ: -4.0, maxZ: 4.3 }
const BLOCKERS = [
  { minX: -4.7, maxX: -1.7, minZ: -4.7, maxZ: -1.6 }, // bed
  { minX: 3.4, maxX: 5.0, minZ: -3.4, maxZ: -1.8 }, // desk
]

// Live world state shared with hotspot click handlers (imperative on purpose —
// positions change every frame and must not round-trip through React).
export const sisterPositions: Record<SisterId, THREE.Vector3> = {
  mackenzie: new THREE.Vector3(-0.8, 0, 2.6),
  cambrie: new THREE.Vector3(-2.1, 0, 3.2),
}

const motions: Record<SisterId, { heading: number; walking: boolean }> = {
  mackenzie: { heading: Math.PI, walking: false },
  cambrie: { heading: Math.PI, walking: false },
}

const controller = {
  target: null as THREE.Vector3 | null,
  onArrive: null as (() => void) | null,
  followerCatchingUp: false,
}

function insideBlocker(x: number, z: number) {
  return BLOCKERS.some(
    (b) => x > b.minX && x < b.maxX && z > b.minZ && z < b.maxZ,
  )
}

function clampPoint(x: number, z: number): [number, number] {
  let cx = THREE.MathUtils.clamp(x, BOUNDS.minX, BOUNDS.maxX)
  let cz = THREE.MathUtils.clamp(z, BOUNDS.minZ, BOUNDS.maxZ)
  for (const b of BLOCKERS) {
    if (cx > b.minX && cx < b.maxX && cz > b.minZ && cz < b.maxZ) {
      // push out through the nearest face
      const pushes: [number, number, number][] = [
        [Math.abs(cx - b.minX), b.minX - 0.05, cz],
        [Math.abs(cx - b.maxX), b.maxX + 0.05, cz],
        [Math.abs(cz - b.minZ), cx, b.minZ - 0.05],
        [Math.abs(cz - b.maxZ), cx, b.maxZ + 0.05],
      ]
      pushes.sort((a, b2) => a[0] - b2[0])
      cx = pushes[0][1]
      cz = pushes[0][2]
    }
  }
  return [cx, cz]
}

export function walkTo(x: number, z: number, onArrive?: () => void) {
  const [cx, cz] = clampPoint(x, z)
  controller.target = new THREE.Vector3(cx, 0, cz)
  controller.onArrive = onArrive ?? null
}

export function activeSisterDistanceTo(x: number, z: number): number {
  const pos = sisterPositions[useGame.getState().activeSister]
  return Math.hypot(pos.x - x, pos.z - z)
}

// Move a point toward a target with axis-sliding around blocker boxes.
function step(pos: THREE.Vector3, target: THREE.Vector3, dist: number) {
  const dir = new THREE.Vector3().subVectors(target, pos)
  dir.y = 0
  const len = dir.length()
  if (len < 1e-5) return
  dir.multiplyScalar(Math.min(dist, len) / len)
  const nx = pos.x + dir.x
  const nz = pos.z + dir.z
  if (!insideBlocker(nx, nz)) {
    pos.x = nx
    pos.z = nz
  } else if (!insideBlocker(nx, pos.z)) {
    pos.x = nx
  } else if (!insideBlocker(pos.x, nz)) {
    pos.z = nz
  }
}

function makeLabelTexture(text: string, color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 80
  const g = canvas.getContext('2d')!
  g.fillStyle = 'rgba(6, 8, 18, 0.5)'
  g.beginPath()
  g.roundRect(28, 14, 200, 52, 14)
  g.fill()
  g.font = 'bold 32px Georgia, serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillStyle = color
  g.fillText(text, 128, 42)
  return new THREE.CanvasTexture(canvas)
}

const LOOKS: Record<SisterId, { body: string; skirt: string; label: string }> = {
  mackenzie: { body: '#5a8f3a', skirt: '#3d6626', label: '#a8d97f' },
  cambrie: { body: '#c06a22', skirt: '#8f4c14', label: '#f0b06a' },
}

function SisterFigure({ id }: { id: SisterId }) {
  const group = useRef<THREE.Group>(null)
  const look = LOOKS[id]
  const label = useMemo(() => makeLabelTexture(id.toUpperCase(), look.label), [id, look.label])
  useEffect(() => () => label.dispose(), [label])

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    const pos = sisterPositions[id]
    const motion = motions[id]
    g.position.x = pos.x
    g.position.z = pos.z
    g.position.y = motion.walking
      ? Math.abs(Math.sin(clock.elapsedTime * 9)) * 0.07
      : 0
    g.rotation.y = motion.heading
  })

  return (
    <group ref={group}>
      <mesh position={[0, 0.32, 0]} castShadow>
        <coneGeometry args={[0.38, 0.68, 20]} />
        <meshStandardMaterial color={look.skirt} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.86, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.42, 6, 16]} />
        <meshStandardMaterial color={look.body} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.38, 0]} castShadow>
        <sphereGeometry args={[0.19, 20, 16]} />
        <meshStandardMaterial color="#e2bd9c" roughness={0.7} />
      </mesh>
      <sprite position={[0, 1.85, 0]} scale={[1.15, 0.36, 1]}>
        <spriteMaterial map={label} transparent depthWrite={false} />
      </sprite>
    </group>
  )
}

export function Sisters() {
  const activeRing = useRef<THREE.Mesh>(null)
  const activeSister = useGame((s) => s.activeSister)

  // A swap cancels any in-flight walk order — the new active sister
  // shouldn't inherit her sibling's destination.
  useEffect(() => {
    controller.target = null
    controller.onArrive = null
  }, [activeSister])

  useFrame(({ clock }, dt) => {
    const active = useGame.getState().activeSister
    const other: SisterId = active === 'mackenzie' ? 'cambrie' : 'mackenzie'
    const activePos = sisterPositions[active]
    const otherPos = sisterPositions[other]

    // Active sister: walk toward the ordered target
    let activeWalking = false
    if (controller.target) {
      const d = Math.hypot(
        controller.target.x - activePos.x,
        controller.target.z - activePos.z,
      )
      if (d <= ARRIVE) {
        const done = controller.onArrive
        controller.target = null
        controller.onArrive = null
        done?.()
      } else {
        activeWalking = true
        motions[active].heading = Math.atan2(
          controller.target.x - activePos.x,
          controller.target.z - activePos.z,
        )
        step(activePos, controller.target, SPEED * dt)
      }
    }
    motions[active].walking = activeWalking

    // Follower: trail behind, stop at a polite distance (with hysteresis
    // so she doesn't stutter at the trigger boundary)
    const gap = Math.hypot(activePos.x - otherPos.x, activePos.z - otherPos.z)
    const shouldFollow =
      gap > FOLLOW_TRIGGER || (controller.followerCatchingUp && gap > FOLLOW_STOP)
    if (shouldFollow) {
      motions[other].heading = Math.atan2(
        activePos.x - otherPos.x,
        activePos.z - otherPos.z,
      )
      step(otherPos, activePos, SPEED * 0.92 * dt)
    }
    controller.followerCatchingUp = shouldFollow
    motions[other].walking = shouldFollow

    // Gold ring under the active sister
    if (activeRing.current) {
      activeRing.current.position.set(activePos.x, 0.02, activePos.z)
      const pulse = 0.85 + Math.sin(clock.elapsedTime * 3) * 0.15
      activeRing.current.scale.setScalar(pulse)
    }
  })

  return (
    <>
      <SisterFigure id="mackenzie" />
      <SisterFigure id="cambrie" />
      <mesh ref={activeRing} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.5, 40]} />
        <meshBasicMaterial color="#d4af6a" transparent opacity={0.75} />
      </mesh>
    </>
  )
}
