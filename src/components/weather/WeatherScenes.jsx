import React, { useMemo } from "react";

// Animated atmospheric scenes rendered on top of the thermal gradient.

export function RainScene() {
  const drops = useMemo(
    () =>
      Array.from({ length: 90 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.5 + Math.random() * 0.6,
        height: 14 + Math.random() * 20,
        opacity: 0.25 + Math.random() * 0.4,
      })),
    []
  );
  return (
    <div className="absolute inset-0">
      {drops.map((d, i) => (
        <span
          key={i}
          className="absolute top-0 w-px bg-gradient-to-b from-transparent via-white/70 to-white/30"
          style={{
            left: `${d.left}%`,
            height: `${d.height}px`,
            opacity: d.opacity,
            animation: `rain-fall ${d.duration}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function ThunderScene() {
  return (
    <div className="absolute inset-0">
      <RainScene />
      <div
        className="absolute inset-0 bg-white"
        style={{ animation: "lightning-flash 7s ease-in-out infinite" }}
      />
    </div>
  );
}

export function SnowScene() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 70 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 5 + Math.random() * 6,
        size: 3 + Math.random() * 6,
        opacity: 0.4 + Math.random() * 0.5,
      })),
    []
  );
  return (
    <div className="absolute inset-0">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-full bg-white"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.opacity,
            animation: `snow-fall ${f.duration}s linear ${f.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function SunScene() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute rounded-full"
        style={{
          top: "6%",
          right: "10%",
          width: "160px",
          height: "160px",
          background:
            "radial-gradient(circle, rgba(255,243,180,0.95) 0%, rgba(255,210,90,0.6) 38%, rgba(255,180,60,0) 70%)",
          animation: "sun-glow 5s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export function NightScene() {
  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 65,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
        size: 1 + Math.random() * 2,
      })),
    []
  );
  return (
    <div className="absolute inset-0">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `star-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      <div
        className="absolute rounded-full"
        style={{
          top: "8%",
          right: "12%",
          width: "100px",
          height: "100px",
          background:
            "radial-gradient(circle, rgba(245,245,230,0.95) 0%, rgba(225,225,210,0.4) 50%, rgba(210,210,195,0) 70%)",
        }}
      />
    </div>
  );
}

export function CloudScene() {
  const clouds = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        top: 6 + i * 16 + Math.random() * 8,
        scale: 0.7 + Math.random() * 0.9,
        duration: 55 + Math.random() * 55,
        delay: -Math.random() * 60,
        opacity: 0.3 + Math.random() * 0.3,
      })),
    []
  );
  return (
    <div className="absolute inset-0">
      {clouds.map((c, i) => (
        <div
          key={i}
          className="absolute left-0"
          style={{
            top: `${c.top}%`,
            opacity: c.opacity,
            transform: `scale(${c.scale})`,
            animation: `cloud-drift ${c.duration}s linear ${c.delay}s infinite`,
          }}
        >
          <CloudShape />
        </div>
      ))}
    </div>
  );
}

export function FogScene() {
  return (
    <div className="absolute inset-0">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute h-28 w-[200%] -left-1/2 rounded-full"
          style={{
            top: `${15 + i * 22}%`,
            background: "rgba(255,255,255,0.22)",
            filter: "blur(28px)",
            animation: `fog-drift ${18 + i * 8}s ease-in-out ${i * -4}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

function CloudShape() {
  return (
    <div
      className="rounded-full"
      style={{
        width: "170px",
        height: "55px",
        background: "rgba(255,255,255,0.9)",
        filter: "blur(6px)",
      }}
    />
  );
}