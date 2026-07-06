import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Fixed cinematic camera framing the chamber like a 2D background painting,
// with a slight pointer parallax for life.
const BASE = new THREE.Vector3(0, 4.5, 8.8)
const TARGET = new THREE.Vector3(0, 1.0, -1.2)

export function CameraRig() {
  const camera = useThree((s) => s.camera)

  useFrame(({ pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      BASE.x + pointer.x * 0.4,
      0.05,
    )
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      BASE.y + pointer.y * 0.25,
      0.05,
    )
    camera.position.z = BASE.z
    camera.lookAt(TARGET)
  })

  return null
}
