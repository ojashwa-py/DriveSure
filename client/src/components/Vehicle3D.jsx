import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei';
import { useRef, useState, Suspense } from 'react';

// A simple low-poly car constructed from geometries
const LowPolyCar = ({ color = "#4287f5" }) => {
    return (
        <group position={[0, 0.5, 0]}>
            {/* Chassis */}
            <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[2, 0.5, 4.5]} />
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Cabin */}
            <mesh position={[0, 1.0, -0.5]}>
                <boxGeometry args={[1.8, 0.7, 2.5]} />
                <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} transparent opacity={0.9} />
            </mesh>

            {/* Wheels */}
            <Wheel position={[-1.1, 0, 1.5]} />
            <Wheel position={[1.1, 0, 1.5]} />
            <Wheel position={[-1.1, 0, -1.5]} />
            <Wheel position={[1.1, 0, -1.5]} />

            {/* Headlights */}
            <mesh position={[-0.6, 0.4, 2.26]}>
                <boxGeometry args={[0.5, 0.2, 0.1]} />
                <meshStandardMaterial color="#ccffff" emissive="#ccffff" emissiveIntensity={2} />
            </mesh>
            <mesh position={[0.6, 0.4, 2.26]}>
                <boxGeometry args={[0.5, 0.2, 0.1]} />
                <meshStandardMaterial color="#ccffff" emissive="#ccffff" emissiveIntensity={2} />
            </mesh>

            {/* Tail lights */}
            <mesh position={[-0.6, 0.4, -2.26]}>
                <boxGeometry args={[0.5, 0.2, 0.1]} />
                <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
            </mesh>
            <mesh position={[0.6, 0.4, -2.26]}>
                <boxGeometry args={[0.5, 0.2, 0.1]} />
                <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
            </mesh>
        </group>
    );
};

const Wheel = ({ position }) => {
    return (
        <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.25, 0.25, 0.35, 16]} />
                <meshStandardMaterial color="#333" metalness={0.8} />
            </mesh>
        </mesh>
    );
};

// A simple low-poly bike
const LowPolyBike = ({ color = "#f54242" }) => {
    return (
        <group position={[0, 0.8, 0]}>
            {/* Body */}
            <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[0.4, 0.6, 2]} />
                <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Front Wheel */}
            <Wheel position={[0, -0.8, 1.2]} />

            {/* Back Wheel */}
            <Wheel position={[0, -0.8, -1.2]} />

            {/* Handlebars */}
            <mesh position={[0, 0.8, 0.8]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.05, 0.05, 1, 12]} />
                <meshStandardMaterial color="#ccc" metalness={1} />
            </mesh>
        </group>
    )
}

const Vehicle3D = ({ type = 'Car', color }) => {
    return (
        <div className="h-[400px] w-full bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl overflow-hidden relative border border-slate-700/50 shadow-2xl">
            <div className="absolute top-4 left-4 z-10 glass px-4 py-2 rounded-lg">
                <span className="text-xs text-blue-300 uppercase tracking-widest font-bold">Holographic View</span>
            </div>

            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[4, 3, 6]} fov={50} />

                {/* Lights */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} color={type === 'Car' ? '#4287f5' : '#f54242'} />

                <Suspense fallback={null}>
                    <Environment preset="city" />
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        {type === 'Car' ? <LowPolyCar color={color || "#4287f5"} /> : <LowPolyBike color={color || "#f54242"} />}
                    </Float>
                </Suspense>

                <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />

                <OrbitControls
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={2}
                />
            </Canvas>
        </div>
    );
};

export default Vehicle3D;
