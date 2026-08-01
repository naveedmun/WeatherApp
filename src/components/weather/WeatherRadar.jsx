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
  const API_KEY = "969927f300a1463a63ade687d3ed564e";

  return (
    <div>
      <h2 className="text-white text-2xl font-heading mb-2 px-1">Live Weather Radar & Precipitation</h2>
      <p className="text-white/60 text-sm mb-4 px-1">Showing real-time rain and cloud precipitation layers over the region.</p>
      
      <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl h-[380px] md:h-[480px]">
        <MapContainer
          center={center}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
          className="bg-slate-200"
          zoomControl={true}
        >
          <ChangeView center={center} />
          
          {/* Light Base Map: Shahron ke naam aur borders bilkul clear dikhane ke liye */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          
          {/* Weather Radar Layer (Precipitation): Yeh live weather system ko colorful spots mein dikhayega */}
          <TileLayer
            url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
            opacity={0.65}
          />
          
          {/* Location Marker */}
          <CircleMarker
            center={center}
            radius={8}
            pathOptions={{ color: "#E63946", fillColor: "#E63946", fillOpacity: 0.9 }}
          />
        </MapContainer>
      </div>
      <p className="text-white/40 text-xs mt-2 px-1">
        Data powered by OpenWeatherMap Satellites. Green/Yellow patches indicate cloud precipitation and rain systems.
      </p>
    </div>
  );
}