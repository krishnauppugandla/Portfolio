import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Icosahedron({ mouse }) {
  const meshRef = useRef();
  const wireRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.004;
    meshRef.current.rotation.x += 0.002;
    // Lerp toward mouse
    meshRef.current.rotation.x += (mouse.y * 0.3 - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y += (mouse.x * 0.3 - meshRef.current.rotation.y) * 0.05;
    if (wireRef.current) {
      wireRef.current.rotation.copy(meshRef.current.rotation);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshPhongMaterial
          color="#ffffff"
          shininess={100}
          specular={new THREE.Color('#2563EB')}
        />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.62, 1]} />
        <meshBasicMaterial
          color="#2563EB"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handle, { passive: true });
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight intensity={1} position={[5, 5, 5]} color="#ffffff" />
      <pointLight intensity={0.8} position={[-3, -3, -3]} color="#2563EB" />
      <Icosahedron mouse={mouse} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      <Environment preset="city" />
    </>
  );
}

function FallbackShape() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="w-48 h-48 rounded-full border-2 border-blue opacity-30"
        style={{ boxShadow: '0 0 60px rgba(37,99,235,0.2)' }}
      />
    </div>
  );
}

class ThreeErrorBoundary extends Error {}

import { Component } from 'react';
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: false }; }
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    if (this.state.error) return <FallbackShape />;
    return this.props.children;
  }
}

export default function FloatingShape() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<FallbackShape />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </ErrorBoundary>
  );
}
