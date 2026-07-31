import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";

const API_KEY = "969927f300a1463a63ade687d3ed564e";

export default function CitySearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        // OpenWeatherMap Geocoding API direct call
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
        );
        if (!res.ok) throw new Error("Search failed");
        
        const data = await res.json();
        
        // Data ko original format { name, country, lat, lon, label } mein convert kar rahe hain
        const mappedResults = data.map((item) => ({
          name: item.name,
          country: item.country,
          lat: item.lat,
          lon: item.lon,
          label: item.state ? `${item.name}, ${item.state}, ${item.country}` : `${item.name}, ${item.country}`
        }));

        setResults(mappedResults);
        setOpen(true);
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce taake API bar bar faltu hit na ho
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (city) => {
    onSelect(city);
    setQuery(city.label);
    setOpen(false);
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-xl">
      <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-3.5 shadow-2xl focus-within:border-cyan-300/60 transition">
        <Search className="w-5 h-5 text-white/70 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Search any city worldwide..."
          className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-lg"
        />
        {loading && (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
        )}
        {query && !loading && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="text-white/60 hover:text-white shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
          {results.map((c, i) => (
            <button
              key={i}
              onClick={() => select(c)}
              className="flex items-center gap-3 w-full px-5 py-3 hover:bg-white/10 transition text-left border-b border-white/5 last:border-0"
            >
              <MapPin className="w-4 h-4 text-cyan-300 shrink-0" />
              <span className="text-white/90">{c.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}