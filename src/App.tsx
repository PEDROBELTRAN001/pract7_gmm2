import { useState, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Mesh, Group } from 'three'
import './App.css'
//cubito
function CuboInteractivo() {
  const meshRef = useRef<Mesh>(null!)
  const [encima, setEncima] = useState(false)
  const colores = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#9b59b6']
  const [indiceColor, setIndiceColor] = useState(0)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8
      meshRef.current.rotation.x += delta * 0.4
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[-2, 4, -2]}
      scale={encima ? 1.2 : 1}
      onPointerOver={() => setEncima(true)}
      onPointerOut={() => setEncima(false)}
      onClick={() => setIndiceColor((prev) => (prev + 1) % colores.length)}
    >
      <boxGeometry args={[1.3, 1.3, 1.3]} />
      <meshBasicMaterial color={colores[indiceColor]} />
    </mesh>
  )
}

//carita
function CaritaInteractiva() {
  const groupRef = useRef<Group>(null!)
  const [encima, setEncima] = useState(false)
  const [contador, setContador] = useState(0)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6
    }
  })

  return (
    <group
      ref={groupRef}
      position={[4, 2, -3]}
      scale={encima ? 1.2 : 1}
      onPointerOver={() => setEncima(true)}
      onPointerOut={() => setEncima(false)}
      onClick={() => setContador((c) => c + 1)}
    >
      {/* Cabeza plana (moneda / disco simple con pocos segmentos) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.15, 20]} />
        <meshBasicMaterial color="#ffd32a" />
      </mesh>

      {/* Ojo izquierdo (delante y detrás) */}
      <mesh position={[-0.3, 0.2, 0]}>
        <boxGeometry args={[0.15, 0.25, 0.2]} />
        <meshBasicMaterial color="#1e272e" />
      </mesh>

      {/* Ojo derecho (delante y detrás) */}
      <mesh position={[0.3, 0.2, 0]}>
        <boxGeometry args={[0.15, 0.25, 0.2]} />
        <meshBasicMaterial color="#1e272e" />
      </mesh>

      {/* Sonrisa simple (arco frontal y trasero) */}
      <mesh position={[0, -0.1, 0.08]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.35, 0.06, 8, 12, Math.PI]} />
        <meshBasicMaterial color="#1e272e" />
      </mesh>
      <mesh position={[0, -0.1, -0.08]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.35, 0.06, 8, 12, Math.PI]} />
        <meshBasicMaterial color="#1e272e" />
      </mesh>

      {/* Etiqueta flotante con el contador de clics */}
      <Html position={[0, 1.4, 0]} center distanceFactor={8}>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          Clics: {contador}
        </div>
      </Html>
    </group>
  )
}
//corazon 
function CorazonInteractivo() {
  const meshRef = useRef<Mesh>(null!)
  const [encima, setEncima] = useState(false)
  const [alambre, setAlambre] = useState(false)
  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0.25)
    shape.bezierCurveTo(0, 0.25, -0.2, 0.65, -0.6, 0.65)
    shape.bezierCurveTo(-1.1, 0.65, -1.1, -0.05, -1.1, -0.05)
    shape.bezierCurveTo(-1.1, -0.45, -0.65, -0.85, 0, -1.2)
    shape.bezierCurveTo(0.65, -0.85, 1.1, -0.45, 1.1, -0.05)
    shape.bezierCurveTo(1.1, -0.05, 1.1, 0.65, 0.6, 0.65)
    shape.bezierCurveTo(0.2, 0.65, 0, 0.25, 0, 0.25)

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.25,
      bevelEnabled: false,
      curveSegments: 6, 
    })
    geo.center()
    return geo
  }, [])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.2
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={heartGeometry}
      position={[2.8, 0, -1]}
      scale={encima ? 0.95 : 0.8}
      onPointerOver={() => setEncima(true)}
      onPointerOut={() => setEncima(false)}
      
    >
      <meshBasicMaterial color="#ff4757" wireframe={alambre} />
    </mesh>
  )
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
        <Suspense fallback={null}>
          <Environment files="/360_1.jpg" background />
        </Suspense>
        <CuboInteractivo />
        <CaritaInteractiva />
        <CorazonInteractivo />
      </Canvas>
    </div>
  )
}

export default App