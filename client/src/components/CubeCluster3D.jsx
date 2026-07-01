import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Edges } from '@react-three/drei';
import * as THREE from 'three';

const GlowingCube = ({ position, color }) => {
  const mesh = useRef();
  
  // Gentle floating animation for each individual cube
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(time * 2 + position[0] + position[2]) * 0.05;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      {/* Bright Glowing Material */}
      <meshPhysicalMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        transparent={true}
        opacity={0.8}
        roughness={0.1}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
      {/* Dotted/Grid Edges to match the requested aesthetic */}
      <Edges 
        scale={1.0} 
        threshold={15} 
        color="#ffffff" 
        linewidth={3} 
        transparent 
        opacity={0.8}
      />
    </mesh>
  );
};

const CubeGrid = () => {
  const group = useRef();
  
  // Rotate the entire cluster slowly
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      group.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <group ref={group} scale={0.6}>
      {/* Bottom Layer - Full 3x3 */}
      {[-1, 0, 1].map(x => 
        [-1, 0, 1].map(z => (
          <GlowingCube key={`b-${x}-${z}`} position={[x, -1, z]} color="#a855f7" /> // Purple
        ))
      )}

      {/* Middle Layer - Cross Shape */}
      <GlowingCube position={[0, 0, 0]} color="#06b6d4" /> {/* Cyan Center */}
      <GlowingCube position={[-1, 0, 0]} color="#3b82f6" /> {/* Blue Sides */}
      <GlowingCube position={[1, 0, 0]} color="#3b82f6" />
      <GlowingCube position={[0, 0, -1]} color="#3b82f6" />
      <GlowingCube position={[0, 0, 1]} color="#3b82f6" />

      {/* Top Layer - Single Center */}
      <GlowingCube position={[0, 1, 0]} color="#06b6d4" />
    </group>
  );
};

const CubeCluster3D = () => {
  return (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center cursor-move touch-none pb-12">
      <Canvas 
        camera={{ position: [8, 8, 8], fov: 25 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[10, 20, 10]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={1.5} color="#a855f7" />
        <pointLight position={[0, 2, 0]} intensity={2} color="#06b6d4" distance={10} />
        
        <Center>
          <CubeGrid />
        </Center>
      </Canvas>
    </div>
  );
};

export default CubeCluster3D;
