import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 7);
  }, [center[0], center[1]]);
  return null;
}

export default function WeatherRadar({ lat, lon }) {
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const center = [lat, lon];

  useEffect(() => {
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((r) => r.json())
      .then((data) => {
        // RainViewer returns nowcast as an array — spread it directly, don't wrap.
        const past = data.radar?.past || [];
        const nowcast = data.radar?.nowcast || [];
        const all = [...past, ...nowcast];
        setFrames(all);
        setFrameIdx(all.length - 1);
      })
      .catch(() => setFrames([]));
  }, []);

  useEffect(() => {
    if (!playing || frames.length === 0) return;
    const id = setInterval(() => {
      setFrameIdx((i) => (i + 1) % frames.length);
    }, 700);
    return () => clearInterval(id);
  }, [playing, frames.length]);

  const frame = frames[frameIdx];
  const timeLabel =
    frame && typeof frame.time === "number"
      ? new Date(frame.time * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  if (frames.length === 0) {
    return (
      <div>
        <h2 className="text-white text-2xl font-heading mb-4 px-1">Live Precipitation Radar</h2>
        <div className="rounded-2xl border border-white/20 bg-white/5 h-[340px] md:h-[460px] flex items-center justify-center text-white/50">
          Loading radar…
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-white text-2xl font-heading mb-4 px-1">Live Precipitation Radar</h2>
      <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl h-[340px] md:h-[460px]">
        <MapContainer
          center={center}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          className="bg-slate-600"
          zoomControl={false}
        >
          <ChangeView center={center} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap &copy; CARTO"
          />
          {frame && frame.path && (
            <TileLayer
              url={`https://tilecache.rainviewer.com/v2/radar/${frame.path}/256/{z}/{x}/{y}/2_1.png`}
              opacity={0.75}
            />
          )}
          <CircleMarker
            center={center}
            radius={6}
            pathOptions={{ color: "#FF6B35", fillColor: "#FF6B35", fillOpacity: 0.9 }}
          />
        </MapContainer>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/20 px-4 py-2 shadow-xl">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="text-white text-sm w-6 text-center"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "⏸" : "▶"}
          </button>
          <input
            type="range"
            min={0}
            max={frames.length - 1}
            value={frameIdx}
            onChange={(e) => {
              setFrameIdx(Number(e.target.value));
              setPlaying(false);
            }}
            className="w-28 sm:w-40 accent-orange-400"
          />
          <span className="text-white/70 text-xs w-20 text-center">{timeLabel}</span>
        </div>
      </div>
      <p className="text-white/50 text-xs mt-2 px-1">
        Scrub the slider to time-travel through {frames.length} radar frames. Data by RainViewer.
      </p>
    </div>
  );
}