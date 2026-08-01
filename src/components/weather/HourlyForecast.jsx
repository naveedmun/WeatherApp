import React from "react";
import { Droplets } from "lucide-react";

export default function HourlyForecast({ hourly }) {
  if (!hourly || hourly.length === 0) return null;

  const nextHours = hourly.slice(0, 12);

  return (
    <div className="mb-8">
      <h2 className="text-white text-2xl font-heading mb-4 px-1">Hourly Forecast</h2>
      
      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 px-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {nextHours.map((hour, index) => {
          const temp = hour.main?.temp ?? hour.temp ?? 30;
          const conditionText = hour.weather?.[0]?.description || "Clear";
          const capitalizedCondition = conditionText.charAt(0).toUpperCase() + conditionText.slice(1);
          const iconCode = hour.weather?.[0]?.icon;

          // Safe time string based on index to completely avoid any date error
          const timeString = index === 0 ? "Now" : `${index * 3}h Later`;

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-between min-w-[100px] bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 text-center hover:bg-white/15 transition duration-300 group"
            >
              <span className="text-white/70 text-sm font-medium">
                {timeString}
              </span>

              <span className="text-3xl my-3 transform group-hover:scale-110 transition duration-300">
                {weatherEmoji(iconCode)}
              </span>

              <span className="text-white font-bold text-lg mb-2">
                {Math.round(temp)}°
              </span>

              <div className="flex flex-col gap-0.5 text-[11px] text-white/50 w-full border-t border-white/5 pt-2">
                <div className="flex items-center justify-center gap-1 text-cyan-300">
                  <Droplets className="w-3 h-3 shrink-0" />
                  <span>{hour.main?.humidity ?? hour.humidity ?? 50}%</span>
                </div>
                <div className="truncate text-[10px] text-white/40">
                  {capitalizedCondition}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function weatherEmoji(code) {
  if (!code) return "🌤️";
  if (code.startsWith("01")) return code.endsWith("d") ? "☀️" : "🌙";
  if (code.startsWith("02")) return code.endsWith("d") ? "🌤️" : "☁️";
  if (code.startsWith("03") || code.startsWith("04")) return "☁️";
  if (code.startsWith("09")) return "🌧️";
  if (code.startsWith("10")) return "🌦️";
  if (code.startsWith("11")) return "⛈️";
  if (code.startsWith("13")) return "❄️";
  if (code.startsWith("50")) return "🌫️";
  return "🌤️";
}