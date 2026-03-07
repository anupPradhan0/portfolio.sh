"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import * as THREE from "three";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Html, useTexture, useGLTF } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import "@/public/css/IdentityComp.css";

extend({ MeshLineGeometry, MeshLineMaterial });
useGLTF.preload("/models/card.glb");
useTexture.preload("/images/lanyard.jpg");

interface IdentityCompProps {
  name?: string;
  title?: string;
  company?: string;
  photo?: string;
  id?: string;
}

function Band({
  maxSpeed = 50,
  minSpeed = 10,
  name,
  title,
  company,
  photo,
  id,
  isMobile,
}: {
  maxSpeed?: number;
  minSpeed?: number;
  name: string;
  title: string;
  company: string;
  photo: string;
  id: string;
  isMobile: boolean;
}) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false,
    angularDamping: 2,
    linearDamping: 2,
  };

  const { width, height } = useThree((state) => state.size);
  const { nodes, materials } = useGLTF("/models/card.glb") as any;
  const texture = useTexture("/images/lanyard.jpg");
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = "chordal";

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
          colliders={false}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e as any).target.releasePointerCapture((e as any).pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e as any).target.setPointerCapture((e as any).pointerId);
              drag(
                new THREE.Vector3()
                  .copy((e as any).point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
          >
            {/* Clip piece - the metal connector (moved to top of card) */}
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
              position={[0, 0.95, 0]}
            />
            {/* Clamp piece - the holder (moved to top of card) */}
            <mesh 
              geometry={nodes.clamp.geometry} 
              material={materials.metal} 
              position={[0, 0.95, 0]}
            />
            
            {/* Card with HTML content */}
            <Html
              transform
              occlude="blending"
              distanceFactor={isMobile ? 2.2 : 2.0}
              position={[0, 0.35, 0.01]}
              style={{
                pointerEvents: "none",
                userSelect: "none",
                width: isMobile ? "220px" : "260px",
              }}
            >
              <article
                className={`identity-card ${hovered || dragged ? "hovered" : ""} ${
                  isMobile ? "mobile" : ""
                }`}
                aria-label={`Identity card for ${name}, ${title}`}
                itemScope
                itemType="https://schema.org/Person"
                style={{
                  margin: 0,
                  width: isMobile ? "220px" : "260px",
                  height: isMobile ? "290px" : "340px",
                }}
              >
                <div aria-hidden="true" className="backdrop-glow" />
                <div aria-hidden="true" className="crt-scanlines" />

                <header className="card-header">
                  <div className="company-logo" aria-hidden="true">
                    <span className="logo-icon">&lt;/&gt;</span>
                  </div>
                  <div className="company-name" itemProp="worksFor">
                    {company}
                  </div>
                </header>

                <div className="photo-section">
                  <div className="photo-frame">
                    <Image
                      src={photo}
                      alt={`${name} profile photo`}
                      width={150}
                      height={150}
                      className="profile-photo"
                      priority
                      itemProp="image"
                    />
                    <div className="photo-overlay" aria-hidden="true" />
                  </div>
                </div>

                <div className="info-section">
                  <h3 className="employee-name" itemProp="name">
                    {name}
                  </h3>
                  <p className="employee-title" itemProp="jobTitle">
                    {title}
                  </p>
                  <div className="employee-id" itemProp="identifier">
                    ID: {id}
                  </div>
                </div>

                {!isMobile && (
                  <footer className="card-footer">
                    <div className="access-level">
                      <span className="status-indicator" aria-hidden="true" />
                      <span>AUTHORIZED</span>
                    </div>
                  </footer>
                )}

                <div
                  aria-hidden="true"
                  className="holographic-overlay"
                  style={{
                    transform:
                      hovered || dragged
                        ? "translateX(100%)"
                        : "translateX(-100%)",
                    transition: "transform 0.5s ease",
                  }}
                />
              </article>
            </Html>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={texture}
          repeat={[-3, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

const IdentityComp: React.FC<IdentityCompProps> = ({
  name = "Anup Pradhan",
  title = "Software Developer",
  company = "chati.ai",
  photo = "/images/your-photo.jpg",
  id = "EMP001",
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className="identity-container"
      style={{ height: "100%", width: "100%", position: "relative" }}
    >
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }} style={{ touchAction: "none" }}>
        <ambientLight intensity={Math.PI} />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band
            name={name}
            title={title}
            company={company}
            photo={photo}
            id={id}
            isMobile={isMobile}
          />
        </Physics>
        <Environment background blur={0.75}>
          <color attach="background" args={["black"]} />
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>

      {/* Interactive Label */}
      <div
        className="interaction-label"
        role="complementary"
        aria-label="Motivational quote"
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        {isMobile
          ? "[負けたらどうせ俺はその程度の男なんだから…]"
          : "[負けたらどうせ俺はその程度の男なんだから…]"}
      </div>
    </div>
  );
};

export default IdentityComp;
