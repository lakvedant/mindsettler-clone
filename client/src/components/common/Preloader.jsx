import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Float, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

const Model = () => {
  const { scene } = useGLTF('/heart+with+brain+3d+model.glb');
  // Slightly increased scale as requested
  return <primitive object={scene} scale={2.0} position={[0, -0.4, 0]} />;
};

const Preloader = ({ onLoaded }) => {
  useEffect(() => {
    // Keep loader for at least 3 seconds to show the animation
    const timer = setTimeout(() => {
      onLoaded();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#583f7a]/15 via-white to-[#e04073]/15"
    >
      {/* 3D Model Container - Centered relative to screen */}
      <div className="w-full h-80 md:h-[400px] flex items-center justify-center">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} color="#ffffff" />
          <spotLight position={[-10, 5, -10]} angle={0.3} penumbra={1} intensity={1} color="#ffffff" />
          <Suspense fallback={null}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <Model />
            </Float>
            <Environment preset="city" />
            <ContactShadows position={[0, -1, 0]} opacity={0.15} scale={6} blur={2} far={2} color="#000000" />
          </Suspense>
          {/* Much faster rotation speed as requested */}
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={35} />
        </Canvas>
      </div>
    </motion.div>
  );
};

// Preload the model for faster access
useGLTF.preload('/heart+with+brain+3d+model.glb');

export default Preloader;
