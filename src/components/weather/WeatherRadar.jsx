import React, { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 6);
  }, [center[0], center[1]]);
  return null;
}

export default function WeatherRadar({ lat, lon }) {
  const center = [lat, lon];

  return (
    <div>
      <h2 className="text-white text-2xl font-heading mb-2 px-1">Live Weather Radar & Clouds</h2>
      <p className="text-white/60 text-sm mb-4 px-1">Showing real-time cloud movement and rain precipitation layers over the region.</p>
      
      <div className="relative rounded-2xl overflow-hidden border border-white/25 shadow-2xl h-[380px] md:h-[480px]">
        <MapContainer
          center={center}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
          className="bg-slate-900"
          zoomControl={true}
        >
          <ChangeView center={center} />
          
          {/* Dark Base Map taake badal aur radar glowing/clear nazar aayein */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          />
          
          {/* RainViewer Live Radar & Cloud Layer (Bghair kisi API key ke free aur fast live clouds) */}
          <TileLayer
            url="https://tile.rainviewer.com/v2/radar/nowcast/{z}/{x}/{y}/256/2/1_1.png"
            opacity={0.8}
          />
          
          {/* Location Marker */}
          <CircleMarker
            center={center}
            radius={9}
            pathOptions={{ color: "#ffffff", fillColor: "#E63946", fillOpacity: 1, weight: 2 }}
          />
        </MapContainer>
      </div>
      <p className="text-white/40 text-xs mt-2 px-1">
        Data powered by RainViewer Live Satellite Radar. Colored patches indicate active cloud cover and precipitation systems.
      </p>
    </div>
  );
}
