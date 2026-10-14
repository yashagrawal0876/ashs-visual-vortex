import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const pointer = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  });
}

function Core({ lite }: { lite: boolean }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);
  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += (pointer.x * 0.5 - group.current.rotation.y) * 0.04;
      group.current.rotation.x += (pointer.y * 0.3 - group.current.rotation.x) * 0.04;
    }
    if (inner.current) {
      inner.current.rotation.y += dt * 0.25;
      inner.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.04);
    }
    if (rings.current) {
      rings.current.children.forEach((r, i) => {
        r.rotation.z += dt * (0.15 + i * 0.08) * (i % 2 ? -1 : 1);
      });
    }
  });
  return (
    <group ref={group}>
      <Float speed={1.4} floatIntensity={0.6} rotationIntensity={0.2}>
        <mesh ref={inner}>
          <icosahedronGeometry args={[1, lite ? 2 : 4]} />
          <meshPhysicalMaterial color="#9fd8ff" emissive="#3b6cff" emissiveIntensity={0.35} roughness={0.15} metalness={0.2} transmission={0.6} thickness={1.2} clearcoat={1} />
        </mesh>
        <mesh scale={1.35}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#7aa8ff" wireframe transparent opacity={0.18} />
        </mesh>
        <mesh scale={0.45}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#e6f4ff" />
        </mesh>
        <group ref={rings}>
          {[1.9, 2.3, 2.75].map((r, i) => (
            <mesh key={r} rotation={[Math.PI / 2 + i * 0.35, i * 0.5, 0]}>
              <torusGeometry args={[r, 0.008, 8, 160]} />
              <meshBasicMaterial color={["#5b8cff", "#6fd3ff", "#a78bfa"][i] ?? "#6fd3ff"} transparent opacity={0.55} />
            </mesh>
          ))}
        </group>
      </Float>
      <Sparkles count={lite ? 30 : 80} scale={6} size={2.2} speed={0.35} color="#8ab4ff" />
    </group>
  );
}

export function CoreScene({ lite }: { lite: boolean }) {
  return (
    <Canvas dpr={[1, lite ? 1.25 : 1.75]} camera={{ position: [0, 0, 6.5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 3, 5]} intensity={40} color="#7fb2ff" />
      <pointLight position={[-4, -2, 3]} intensity={25} color="#b69bff" />
      <Core lite={lite} />
    </Canvas>
  );
}

function Drift() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const scroll = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
    ref.current.rotation.y += dt * 0.01;
    ref.current.rotation.x += (scroll * 0.8 + pointer.y * 0.05 - ref.current.rotation.x) * 0.03;
    ref.current.position.z = scroll * 30;
  });
  return (
    <group ref={ref}>
      <Stars radius={80} depth={60} count={3000} factor={4} fade speed={0.6} />
      <Sparkles count={60} scale={[40, 40, 40]} size={3} speed={0.2} color="#9ec5ff" opacity={0.6} />
    </group>
  );
}

export function StarScene({ lite }: { lite: boolean }) {
  return (
    <Canvas dpr={[1, lite ? 1 : 1.5]} camera={{ position: [0, 0, 1], fov: 60 }} gl={{ alpha: true }}>
      <Drift />
    </Canvas>
  );
}
