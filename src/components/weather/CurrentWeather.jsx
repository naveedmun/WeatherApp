import React from "react";
import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset } from "lucide-react";
import moment from "moment";

export default function CurrentWeather({ current, city }) {
  if (!current) return null;
  const temp = Math.round(current.main.temp);
  const condition = current.weather[0];

  // Direct safe visibility fallback (10 km default agar undefined ho)
  const visibilityVal = current.main?.visibility ?? 10;

  return (
    <div className="text-center text-white">
      <div className="flex items-center justify-center gap-2 text-white/80 mb-2">
        <span className="text-2xl font-heading">{city?.name || current.name}</span>
        <span className="text-white/40">·</span>
        <span className="text-white/60">{current.sys?.country}</span>
      </div>
      <div
        className="font-display font-bold leading-none"
        style={{ fontSize: "clamp(5rem, 15vw, 11rem)" }}
      >
        {temp}°
      </div>
      <div className="text-2xl font-heading capitalize mt-2">{condition.description}</div>
      <div className="text-white/70 mt-1">Feels like {Math.round(current.main.feels_like)}°C</div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
        <Metric icon={Droplets} label="Humidity" value={`${current.main.humidity}%`} />
        <Metric icon={Wind} label="Wind" value={`${Math.round(current.wind.speed * 3.6)} km/h`} />
        <Metric icon={Gauge} label="Pressure" value={`${current.main.pressure} hPa`} />
        <Metric icon={Eye} label="Visibility" value={`${visibilityVal} km`} />
      </div>

      {current.sys?.sunrise && current.sys?.sunset && (
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
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 px-4 py-3">
      <div className="flex items-center justify-center text-cyan-200">
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-lg font-semibold text-white mt-1">{value}</div>
      <div className="text-xs text-white/60">{label}</div>
    </div>
  );
}