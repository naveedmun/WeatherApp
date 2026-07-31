import React from "react";
import { Coffee, Umbrella, Sun, Cloud } from "lucide-react";

export default function AdTile({ condition, temperature }) {
  const ad = pickAd(condition, temperature);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-5">
      <div className="absolute top-3 right-3 text-[10px] uppercase tracking-wider text-white/40 border border-white/20 rounded px-1.5 py-0.5">
        Sponsored
      </div>
      <div className="flex items-start gap-4 pr-16">
        <div className="rounded-xl bg-cyan-400/20 p-3 shrink-0">
          <ad.icon className="w-6 h-6 text-cyan-300" />
        </div>
        <div>
          <div className="text-white font-heading text-lg">{ad.title}</div>
          <div className="text-white/60 text-sm mt-1">{ad.desc}</div>
          <div className="text-cyan-300 text-xs mt-2">{ad.tag}</div>
        </div>
      </div>
    </div>
  );
}

function pickAd(condition, t) {
  const c = (condition || "").toLowerCase();
  if (c.includes("rain") || c.includes("drizzle"))
    return {
      icon: Umbrella,
      title: "Perfect for a cozy café day",
      desc: "Karachi's best rainy-day coffee spots, just around the corner.",
      tag: "Local Insight",
    };
  if (t >= 35)
    return {
      icon: Sun,
      title: "Beat the heat — chill indoors",
      desc: "Discover air-conditioned coworking spaces near you.",
      tag: "Local Insight",
    };
  if (c.includes("cloud"))
    return {
      icon: Cloud,
      title: "Mild & breezy — ideal for a walk",
      desc: "Explore the Clifton Beach promenade this evening.",
      tag: "Local Insight",
    };
  return {
    icon: Coffee,
    title: "Clear skies, perfect for coffee",
    desc: "Grab an iced latte at Karachi's finest roasteries.",
    tag: "Local Insight",
  };
}