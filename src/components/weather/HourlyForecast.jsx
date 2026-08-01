import React from "react";
import moment from "moment";
import { Droplets, Wind } from "lucide-react";

export default function HourlyForecast({ hourly }) {
  // Agar hourly data load na hua ho ya khali ho
  if (!hourly || hourly.length === 0) return null;

  // Aglay sirf 12 ghanton ka data dikhane ke liye filter
  const nextHours = hourly.slice(0, 12);

  return (
    <div className="mb-8">
      <h2 className="text-white text-2xl font-heading mb-4 px-1">Hourly Forecast</h2>
      
      {/* Horizontal Scrollable Container */}
      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 px-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {nextHours.map((hour, index) => {
          const temp = hour.main?.temp ?? hour.temp;
          const conditionText = hour.weather?.[0]?.description || "Clear";
          const capitalizedCondition = conditionText.charAt(0).toUpperCase() + conditionText.slice(1);
          const iconCode = hour.weather?.[0]?.icon;

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-between min-w-[100px] bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 text-center hover:bg-white/15 transition duration-300 group"
            >
              {/* 1. Time */}
              <span className="text-white/70 text-sm font-medium">
                {index === 0 ? "Now" : moment.unix(hour.dt).format("hh:mm A")}
              </span>

              {/* 2. Weather Emoji / Icon */}
              <span className="text-3xl my-3 transform group-hover:scale-110 transition duration-300">
                {weatherEmoji(iconCode)}
              </span>

              {/* 3. Temperature */}
              <span className="text-white font-bold text-lg mb-2">
                {Math.round(temp)}°
              </span>

              {/* 4. Mini Stats (Rain Chance / Humidity) */}
              <div className="flex flex-col gap-0.5 text-[11px] text-white/50 w-full border-t border-white/5 pt-2">
                <div className="flex items-center justify-center gap-1 text-cyan-300">
                  <Droplets className="w-3 h-3 shrink-0" />
                  <span>{hour.main?.humidity ?? hour.humidity}%</span>
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

// Custom emoji handler based on OpenWeatherMap icon codes - Clear Version
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