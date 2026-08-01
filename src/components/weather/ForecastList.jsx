import React, { useState } from "react";
import moment from "moment";
import { Droplets, Wind, Sun, ChevronDown, CloudRain } from "lucide-react";

export default function ForecastList({ daily }) {
  const [expanded, setExpanded] = useState(0);
  if (!daily || daily.length === 0) return null;

  // Direct safe extractors for high and low temperatures
  const getHi = (d) => {
    return d.temp_max ?? d.main?.temp_max ?? d.temp?.max ?? d.max ?? 30;
  };
  
  const getLo = (d) => {
    return d.temp_min ?? d.main?.temp_min ?? d.temp?.min ?? d.min ?? 25;
  };

  const highs = daily.map((d) => Number(getHi(d)));
  const lows = daily.map((d) => Number(getLo(d)));
  const maxTemp = Math.max(...highs);
  const minTemp = Math.min(...lows);
  const range = maxTemp - minTemp || 1;

  return (
    <div>
      <h2 className="text-white text-2xl font-heading mb-4 px-1">Extended Forecast</h2>
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 overflow-hidden divide-y divide-white/10">
        {daily.slice(0, 10).map((day, i) => {
          const hi = Number(getHi(day));
          const lo = Number(getLo(day));
          const isOpen = expanded === i;
          const leftPct = ((lo - minTemp) / range) * 100;
          const widthPct = Math.max(((hi - lo) / range) * 100, 8);

          const humidity = day.humidity ?? day.main?.humidity;
          const windSpeed = day.wind_speed ?? day.wind?.speed;
          const weatherIcon = day.weather?.[0]?.icon;
          const rainChance = Math.round((day.pop || 0) * 100);

          return (
            <div key={i}>
              <button
                onClick={() => setExpanded(isOpen ? -1 : i)}
                className="w-full flex items-center gap-3 sm:gap-4 px-4 py-3 hover:bg-white/5 transition text-left"
              >
                <div className="w-14 text-white/80 text-sm font-medium shrink-0">
                  {i === 0 ? "Today" : moment.unix(day.dt).format("ddd")}
                </div>
                <div className="text-3xl shrink-0">{weatherEmoji(weatherIcon)}</div>
                <div className="text-cyan-200 text-xs w-9 shrink-0">
                  {rainChance > 5 ? `${rainChance}%` : ""}
                </div>
                <div className="relative flex-1 h-2 bg-white/10 rounded-full overflow-hidden mx-2 hidden sm:block">
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-400 to-orange-400 rounded-full"
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  />
                </div>
                <div className="text-white font-semibold w-10 text-right shrink-0">
                  {Math.round(hi)}°
                </div>
                <div className="text-white/50 w-10 text-right shrink-0">{Math.round(lo)}°</div>
                <ChevronDown
                  className={`w-5 h-5 text-white/40 shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Detail
                    icon={Droplets}
                    label="Humidity"
                    value={humidity != null ? `${humidity}%` : "—"}
                  />
                  <Detail
                    icon={Wind}
                    label="Wind"
                    value={windSpeed != null ? `${Math.round(windSpeed)} km/h` : "—"}
                  />
                  <Detail
                    icon={Sun}
                    label="UV Index"
                    value={day.uvi != null ? Math.round(day.uvi) : "—"}
                  />
                  <Detail
                    icon={CloudRain}
                    label="Rain Chance"
                    value={`${rainChance}%`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
      <Icon className="w-4 h-4 text-cyan-300 shrink-0" />
      <div>
        <div className="text-white text-sm font-medium">{value}</div>
        <div className="text-white/50 text-xs">{label}</div>
      </div>
    </div>
  );
}

function weatherEmoji(code) {
  if (!code) return "🌤️";
  if (typeof code === "string" && code.startsWith("http")) return "🌤️";
  const codeMatch = String(code).match(/(\d+)\.png$/);
  const cleanCode = codeMatch ? codeMatch[1] : String(code);

  if (cleanCode.startsWith("01")) return "☀️";
  if (cleanCode.startsWith("02")) return "🌤️";
  if (cleanCode.startsWith("03")) return "☁️";
  if (cleanCode.startsWith("04")) return "☁️";
  if (cleanCode.startsWith("09")) return "🌧️";
  if (cleanCode.startsWith("10")) return "🌦️";
  if (cleanCode.startsWith("11")) return "⛈️";
  if (cleanCode.startsWith("13")) return "❄️";
  if (cleanCode.startsWith("50")) return "🌫️";
  return "🌤️";
}
