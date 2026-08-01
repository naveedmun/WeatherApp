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

export default function WeatherBackground({ temperature, condition, isDay }) {
  const { bgImage, scene } = useMemo(() => {
    const t = temperature;
    const cond = (condition || "").toLowerCase();
    let imageUrl = "";

    if (!isDay) {
      // Night nature scene (Stars / Moonlit Landscape)
      imageUrl = "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1920&q=80";
    } else if (cond.includes("thunder")) {
      // Thunderstorm Nature Scene (Lightning over hills)
      imageUrl = "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=1920&q=80";
    } else if (cond.includes("rain") || cond.includes("drizzle")) {
      // Rainy Nature Scene (Rain drops on green leaves / forest)
      imageUrl = "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1920&q=80";
    } else if (cond.includes("snow")) {
      // Snowy Mountain Landscape
      imageUrl = "https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1920&q=80";
    } else if (cond.includes("cloud")) {
      // Cloudy Overcast Sky / Mountains
      imageUrl = "https://images.unsplash.com/photo-1483702721041-b23de737a886?auto=format&fit=crop&w=1920&q=80";
    } else if (
      cond.includes("mist") ||
      cond.includes("fog") ||
      cond.includes("haze") ||
      cond.includes("dust")
    ) {
      // Foggy Forest Nature Scene
      imageUrl = "https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1920&q=80";
    } else {
      // Clear Sunny Day Nature Scene (Sunny field / bright sky)
      imageUrl = t >= 30 
        ? "https://images.unsplash.com/photo-1504386106331-3e4e71712b38?auto=format&fit=crop&w=1920&q=80" // Hot day
        : "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80"; // Pleasant day
    }

    // Scene animation logic remains same
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

    return { bgImage: imageUrl, scene: sceneType };
  }, [temperature, condition, isDay]);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-[2000ms] ease-in-out"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay taake weather text aur layers aaram se readable rahein aur content chhupe nahi */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" />
      
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
