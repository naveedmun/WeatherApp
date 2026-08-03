import React from "react";
import moment from "moment";
import { Droplets, CloudRain } from "lucide-react";

export default function HourlyForecast({ hourly }) {
  if (!hourly || hourly.length === 0) return null;

  const nextHours = hourly.slice(0, 12);

  return (
    <div className="mb-8">
      <h2 className="text-white text-2xl font-heading mb-4 px-1">Hourly Forecast</h2>
      
      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 px-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {nextHours.map((hour, index) => {
          const temp = hour.main?.temp ?? hour.temp;
          const conditionText = hour.weather?.[0]?.description || "Clear";
          const capitalizedCondition = conditionText.charAt(0).toUpperCase() + conditionText.slice(1);
          const iconCode = hour.weather?.[0]?.icon;

          const rainChance = hour.pop != null 
            ? Math.round(hour.pop * 100) 
            : (hour.chance_of_rain ?? 0);

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-between min-w-[100px] bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 text-center hover:bg-white/15 transition duration-300 group"
            >
              <span className="text-white/70 text-sm font-medium">
                {index === 0 ? "Now" : moment.unix(hour.dt).format("hh:mm A")}
              </span>

              <span className="text-3xl my-3 transform group-hover:scale-110 transition duration-300">
                {weatherEmoji(iconCode, rainChance)}
              </span>

              <span className="text-white font-bold text-lg mb-2">
                {Math.round(temp)}°
              </span>

              <div className="flex flex-col gap-0.5 text-[11px] text-white/50 w-full border-t border-white/5 pt-2">
                {rainChance > 0 ? (
                  <div className="flex items-center justify-center gap-1 text-cyan-300 font-medium">
                    <CloudRain className="w-3 h-3 shrink-0" />
                    <span>{rainChance}%</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1 text-white/60">
                    <Droplets className="w-3 h-3 shrink-0" />
                    <span>{hour.main?.humidity ?? hour.humidity}%</span>
                  </div>
                )}
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

function weatherEmoji(iconInput, rainChance = 0) {
  if (!iconInput) return "🌤️";
  const codeMatch = String(iconInput).match(/(\d+)\.png$/);
  const code = codeMatch ? codeMatch[1] : String(iconInput);

  // Agar barish ka chance 30% se kam hai, toh barish wala icon forcefully avoid karein
  if (rainChance < 30) {
    if (code === "1063" || (code >= "1180" && code <= "1201") || (code >= "1240" && code <= "1246")) {
      return "⛅"; // Halkay badal ya sunny/cloudy dikhayein agar barish na honay ke barabar hai
    }
  }

  if (code === "1000") return "☀️";
  if (code === "1003") return "🌤️";
  if (code === "1006" || code === "1009") return "☁️";
  if (code === "1030" || code === "1135" || code === "1147") return "🌫️";
  
  // Barish ke icons sirf tab aayenge jab rainChance >= 30% ho
  if (rainChance >= 30) {
    if (code >= "1063" && code <= "1195") return "🌧️";
    if (code >= "1198" && code <= "1201") return "🌧️";
    if (code >= "1240" && code <= "1246") return "🌦️";
  }

  if (code >= "1210" && code <= "1237") return "❄️";
  if (code >= "1273" && code <= "1282") return "⛈️";

  return "🌤️";
}
