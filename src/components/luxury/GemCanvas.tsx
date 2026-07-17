import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function Gem() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.35;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
  });

  // Faceted octahedral gemstone geometry
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={ref} scale={1.6}>
        <octahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={1.2}
          roughness={0.02}
          ior={2.4}
          chromaticAberration={0.35}
          anisotropy={0.6}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.05}
          clearcoat={1}
          attenuationColor={new THREE.Color("#3b6cff")}
          attenuationDistance={0.6}
          color={new THREE.Color("#a8c5ff")}
        />
      </mesh>
      {/* subtle inner accent */}
      <mesh scale={0.75}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#c9a54c" transparent opacity={0.05} />
      </mesh>
    </Float>
  );
}

export function GemCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, -3, -5]} intensity={0.6} color="#c9a54c" />
      <Suspense fallback={null}>
        <Gem />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  );
}
