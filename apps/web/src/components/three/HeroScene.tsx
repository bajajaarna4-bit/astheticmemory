'use client';

import { useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Hero 3D cluster.
 *
 * Deliberately dependency-light (no drei, no HDR environment): a handful of
 * physically-shaded primitives lit by three coloured point lights. That keeps
 * the canvas under ~5ms per frame and lets the whole scene lazy-load only when
 * it scrolls into view.
 */

function useScrollFactor() {
  const ref = useRef(0);

  useFrame(() => {
    ref.current = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
  });

  return ref;
}

function Float({
  children,
  speed = 1,
  offset = 0,
  amplitude = 0.18,
}: {
  children: ReactNode;
  speed?: number;
  offset?: number;
  amplitude?: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + offset;
    ref.current.position.y = Math.sin(t) * amplitude;
    ref.current.rotation.z = Math.sin(t * 0.6) * 0.06;
  });

  return <group ref={ref}>{children}</group>;
}

function Cluster() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const scroll = useScrollFactor();

  useFrame(({ pointer, clock }) => {
    const node = group.current;
    if (!node) return;

    node.rotation.y += (pointer.x * 0.55 + clock.elapsedTime * 0.06 - node.rotation.y) * 0.05;
    node.rotation.x += (-pointer.y * 0.3 - node.rotation.x) * 0.05;
    node.position.y = -scroll.current * 1.1;
    node.scale.setScalar(1 - scroll.current * 0.12);

    if (ring.current) {
      ring.current.rotation.x = 1.25 + Math.sin(clock.elapsedTime * 0.25) * 0.12;
      ring.current.rotation.z = clock.elapsedTime * 0.12;
    }
  });

  const materials = useMemo(
    () => ({
      violet: new THREE.MeshStandardMaterial({
        color: '#7C5CFF',
        emissive: '#2A1A6E',
        metalness: 0.62,
        roughness: 0.22,
      }),
      coral: new THREE.MeshStandardMaterial({
        color: '#FF6B6B',
        emissive: '#5C1A2A',
        metalness: 0.55,
        roughness: 0.28,
      }),
      aqua: new THREE.MeshStandardMaterial({
        color: '#35E7D2',
        emissive: '#0B4A44',
        metalness: 0.6,
        roughness: 0.2,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: '#E9E6FF',
        metalness: 0.95,
        roughness: 0.12,
      }),
    }),
    [],
  );

  return (
    <group ref={group}>
      {/* central capsule - the "product" */}
      <Float speed={0.85} amplitude={0.14}>
        <mesh material={materials.chrome} position={[0, 0.15, 0]} castShadow>
          <capsuleGeometry args={[0.62, 0.95, 12, 32]} />
        </mesh>
      </Float>

      {/* violet rounded plate */}
      <Float speed={0.6} offset={1.4} amplitude={0.22}>
        <mesh material={materials.violet} position={[-1.75, 0.9, -0.6]} rotation={[0.3, 0.5, 0.15]}>
          <boxGeometry args={[1.05, 1.45, 0.16]} />
        </mesh>
      </Float>

      {/* coral torus */}
      <Float speed={0.72} offset={2.6} amplitude={0.2}>
        <mesh material={materials.coral} position={[1.9, 0.55, -0.35]} rotation={[0.9, 0.2, 0.4]}>
          <torusGeometry args={[0.52, 0.19, 24, 64]} />
        </mesh>
      </Float>

      {/* aqua sphere */}
      <Float speed={0.95} offset={3.7} amplitude={0.16}>
        <mesh material={materials.aqua} position={[1.25, -1.25, 0.4]}>
          <icosahedronGeometry args={[0.42, 2]} />
        </mesh>
      </Float>

      {/* small chrome satellite */}
      <Float speed={1.15} offset={0.8} amplitude={0.26}>
        <mesh material={materials.chrome} position={[-1.2, -1.35, 0.8]}>
          <octahedronGeometry args={[0.24, 0]} />
        </mesh>
      </Float>

      {/* orbit ring + wireframe halo */}
      <mesh ref={ring} rotation={[1.25, 0, 0]}>
        <torusGeometry args={[2.5, 0.012, 8, 128]} />
        <meshBasicMaterial color="#B4A4FF" transparent opacity={0.55} />
      </mesh>

      <mesh>
        <icosahedronGeometry args={[2.85, 1]} />
        <meshBasicMaterial color="#7C5CFF" wireframe transparent opacity={0.09} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7.4], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
      aria-hidden
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 3, 4]} intensity={38} color="#7C5CFF" distance={18} />
      <pointLight position={[-4, -2, 3]} intensity={26} color="#FF6B6B" distance={18} />
      <pointLight position={[0, 4, -4]} intensity={30} color="#35E7D2" distance={20} />
      <directionalLight position={[0, 0, 5]} intensity={1.1} />

      <Cluster />
    </Canvas>
  );
}
