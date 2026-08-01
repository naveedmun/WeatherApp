import React from "react";
import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset } from "lucide-react";
import moment from "moment";

export default function CurrentWeather({ current, city }) {
  if (!current) return null;
  const temp = Math.round(current.main?.temp || 0);
  const condition = current.weather?.[0] || { description: "Clear" };

  // Bulletproof visibility extraction (checks every possible object path)
  const rawVis = current.main?.visibility ?? current.visibility ?? current.vis_km ?? 10;
  const visibilityKm = !isNaN(Number(rawVis)) ? Number(rawVis) : 10;

  return (
    <div className="text-center text-white px-2">
      <div className="flex items-center justify-center gap-2 text-white/80 mb-2">
        <span className="text-xl md:text-2xl font-heading">{city?.name || current.name || "Karachi"}</span>
        <span className="text-white/40">·</span>
        <span className="text-white/60">{current.sys?.country || "PK"}</span>
      </div>
      <div
        className="font-display font-bold leading-none"
        style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
      >
        {temp}°
      </div>
      <div className="text-xl md:text-2xl font-heading capitalize mt-2">{condition.description}</div>
      <div className="text-white/70 text-sm md:text-base mt-1">
        Feels like {Math.round(current.main?.feels_like || temp)}°C
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto w-full">
        <Metric icon={Droplets} label="Humidity" value={`${current.main?.humidity ?? 0}%`} />
        <Metric icon={Wind} label="Wind" value={`${Math.round((current.wind?.speed ?? 0) * 3.6)} km/h`} />
        <Metric icon={Gauge} label="Pressure" value={`${current.main?.pressure ?? 1013} hPa`} />
        <Metric icon={Eye} label="Visibility" value={`${visibilityKm.toFixed(1)} km`} />
      </div>

      {current.sys?.sunrise && current.sys?.sunset ? (
        <div className="mt-4 flex items-center justify-center gap-6 text-white/70 text-sm">
          <span className="flex items-center gap-1.5">
            <Sunrise className="w-4 h-4 text-amber-300" />
            {moment.unix(current.sys.sunrise).format("h:mm A")}
          </span>
          <span className="flex items-center gap-1.5">
            <Sunset className="w-4 h-4 text-orange-300" />
            {moment.unix(current.sys.sunset).format("h:mm A")}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-3 flex flex-col items-center justify-center">
      <div className="text-cyan-200 mb-1">
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-base md:text-lg font-semibold text-white">{value}</div>
      <div className="text-xs text-white/60">{label}</div>
    </div>
  );
}