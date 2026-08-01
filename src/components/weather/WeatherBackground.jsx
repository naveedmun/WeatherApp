import React, { useMemo } from "react";
import {
  RainScene,
  ThunderScene,
  SnowScene,
  SunScene,
  NightScene,
  CloudScene,
  FogScene,
} from "@/components/weather/WeatherScenes";

// Dynamic "Living Horizon" background — a thermal gradient PLUS an animated weather scene
// that matches the actual conditions (rain drops, sun glow, drifting clouds, snow, etc.)
export default function WeatherBackground({ temperature, condition, isDay }) {
  const { gradient, scene } = useMemo(() => {
    const t = temperature;
    const cond = (condition || "").toLowerCase();
    let baseGradient;
    if (!isDay) {
      baseGradient = "linear-gradient(180deg, #0B1026 0%, #1A1B3A 50%, #2D1B4E 100%)";
    } else if (cond.includes("thunder")) {
      baseGradient = "linear-gradient(180deg, #2C3E50 0%, #4A3F5C 100%)";
    } else if (cond.includes("rain") || cond.includes("drizzle")) {
      baseGradient = "linear-gradient(180deg, #2E6E8C 0%, #4FA0C4 100%)";
    } else if (cond.includes("snow")) {
      baseGradient = "linear-gradient(180deg, #6B829E 0%, #C8DAEC 100%)";
    } else if (t >= 38) {
      baseGradient = "linear-gradient(180deg, #F24E1E 0%, #FFD600 100%)";
    } else if (t >= 30) {
      baseGradient = "linear-gradient(180deg, #FF6B35 0%, #FFB347 100%)";
    } else if (t >= 20) {
      baseGradient = "linear-gradient(180deg, #2E86DE 0%, #74C0E6 100%)";
    } else if (t >= 10) {
      baseGradient = "linear-gradient(180deg, #4A90D9 0%, #A0C8E8 100%)";
    } else {
      baseGradient = "linear-gradient(180deg, #1A2B4C 0%, #A5C9FF 100%)";
    }

    let sceneType = "none";
    if (cond.includes("thunder")) sceneType = "thunder";
    else if (cond.includes("rain") || cond.includes("drizzle")) sceneType = "rain";
    else if (cond.includes("snow")) sceneType = "snow";
    else if (cond.includes("clear") && isDay) sceneType = "sun";
    else if (cond.includes("clear") && !isDay) sceneType = "night";
    else if (cond.includes("cloud")) sceneType = "clouds";
    else if (
      cond.includes("mist") ||
      cond.includes("fog") ||
      cond.includes("haze") ||
      cond.includes("dust")
    )
      sceneType = "fog";

    return { gradient: baseGradient, scene: sceneType };
  }, [temperature, condition, isDay]);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden transition-all duration-[2000ms] ease-in-out"
      style={{ background: gradient }}
    >
      <div className="absolute inset-0 bg-black/5" />
      {scene === "rain" && <RainScene />}
      {scene === "thunder" && <ThunderScene />}
      {scene === "snow" && <SnowScene />}
      {scene === "sun" && <SunScene />}
      {scene === "night" && <NightScene />}
      {scene === "clouds" && <CloudScene />}
      {scene === "fog" && <FogScene />}
    </div>
  );
}
