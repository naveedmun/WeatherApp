import React, { useState } from "react";
import moment from "moment";
import { Droplets, Wind, Sun, ChevronDown } from "lucide-react";

export default function ForecastList({ daily }) {
  const [expanded, setExpanded] = useState(-1);
  if (!daily || daily.length === 0) return null;

  const highs = daily.map((d) => d.calculated_max ?? d.main?.temp);
  const lows = daily.map((d) => d.calculated_min ?? d.main?.temp);
  const maxTemp = Math.max(...highs);
  const minTemp = Math.min(...lows);
  const range = maxTemp - minTemp || 1;

  // Safe Date formatter to prevent "Invalid date"
  const formatDayName = (dt, i) => {
    if (i === 0) return "Today";
    if (!dt) return moment().add(i, 'days').format("dddd");
    if (typeof dt === 'string') return moment(dt).format("dddd");
    return moment.unix(dt).format("dddd");
  };

  const formatDayDate = (dt, i) => {
    if (!dt) return moment().add(i, 'days').format("DD MMM");
    if (typeof dt === 'string') return moment(dt).format("DD MMM");
    return moment.unix(dt).format("DD MMM");
  };

  return (
    <div>
      <h2 className="text-white text-2xl font-heading mb-4 px-1">5-Day Extended Forecast</h2>
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 overflow-hidden divide-y divide-white/10">
        {daily.map((day, i) => {
          const hi = day.calculated_max ?? day.main?.temp_max;
          const lo = day.calculated_min ?? day.main?.temp_min;
          
          const isOpen = expanded === i;
          const leftPct = ((lo - minTemp) / range) * 100;
          const widthPct = Math.max(((hi - lo) / range) * 100, 8);
          
          const conditionText = day.weather?.[0]?.description || "Clear";
          const capitalizedCondition = conditionText.charAt(0).toUpperCase() + conditionText.slice(1);

          return (
            <div key={i} className="bg-slate-900/20">
              <button
                onClick={() => setExpanded(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between gap-3 sm:gap-4 px-5 py-4 hover:bg-white/5 transition text-left"
              >
                {/* 1. Din aur Date */}
                <div className="w-28 shrink-0">
                  <div className="text-white font-semibold text-base">
                    {formatDayName(day.dt, i)}
                  </div>
                  <div className="text-white/50 text-xs">
                    {formatDayDate(day.dt, i)}
                  </div>
                </div>

                {/* 2. Emoji aur Condition */}
                <div className="flex items-center gap-3 flex-1 min-w-0 mx-2">
                  <div className="text-3xl shrink-0">{weatherEmoji(day.weather?.[0]?.icon)}</div>
                  <div className="text-white/80 text-sm truncate hidden md:block font-light">
                    {capitalizedCondition}
                  </div>
                </div>

                {/* 3. Barish ka chance */}
                <div className="text-cyan-300 text-xs w-12 shrink-0 text-center font-medium">
                  {day.pop > 0.05 ? `💧 ${Math.round(day.pop * 100)}%` : ""}
                </div>

                {/* 4. Visual Slider Line */}
                <div className="relative w-32 h-2 bg-white/10 rounded-full overflow-hidden mx-4 hidden lg:block">
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-400 to-orange-400 rounded-full"
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  />
                </div>

                {/* 5. Distinct High & Low Displays */}
                <div className="flex items-center gap-4 shrink-0 font-heading">
                  <span className="text-orange-300 font-bold text-base w-9 text-right">
                    {Math.round(hi)}°
                  </span>
                  <span className="text-white/40 font-medium text-sm w-9 text-right">
                    {Math.round(lo)}°
                  </span>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-cyan-400" : ""
                  }`}
                />
              </button>

              {/* Accordion Details Panel */}
              {isOpen && (
                <div className="px-5 pb-5 pt-1 grid grid-cols-2 md:grid-cols-4 gap-3 bg-black/10 border-t border-white/5">
                  <Detail icon={Droplets} label="Humidity" value={day.main?.humidity != null ? `${day.main.humidity}%` : "—"} />
                  <Detail icon={Wind} label="Wind Speed" value={day.wind?.speed != null ? `${Math.round(day.wind.speed * 3.6)} km/h` : "—"} />
                  <Detail icon={Sun} label="Cloud Cover" value={day.clouds?.all != null ? `${day.clouds.all}%` : "—"} />
                  <Detail icon={Droplets} label="Precipitation" value={`${Math.round((day.pop || 0) * 100)}%`} />
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
    <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5">
      <Icon className="w-4 h-4 text-cyan-300 shrink-0" />
      <div>
        <div className="text-white text-sm font-semibold">{value}</div>
        <div className="text-white/50 text-xs">{label}</div>
      </div>
    </div>
  );
}

function weatherEmoji(code) {
  if (!code) return "🌤️";
  if (code.startsWith("01")) return "☀️";
  if (code.startsWith("02")) return "🌤️";
  if (code.startsWith("03") || code.startsWith("04")) return "☁️";
  if (code.startsWith("09")) return "🌧️";
  if (code.startsWith("10")) return "🌦️";
  if (code.startsWith("11")) return "⛈️";
  if (code.startsWith("13")) return "❄️";
  if (code.startsWith("50")) return "🌫️";
  return "🌤️";
}